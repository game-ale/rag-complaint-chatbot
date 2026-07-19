import pandas as pd
import os
import time

class StatsEngine:
    def __init__(self, data_path: str):
        self.data_path = data_path
        self._cached_stats = None
        self._last_loaded = 0

    def load_and_compute(self, force=False):
        # Cache for 24 hours or until forced
        if not force and self._cached_stats and (time.time() - self._last_loaded < 86400):
            return self._cached_stats

        print(f"Loading stats from {self.data_path} (limit 500k rows)...")
        if not os.path.exists(self.data_path):
            print(f"Warning: Data file {self.data_path} not found.")
            return self._get_fallback_stats()

        try:
            # Read first 500k rows for stats
            df = pd.read_csv(self.data_path, nrows=500000, low_memory=False)
            
            # Basic cleaning
            df['Date received'] = pd.to_datetime(df['Date received'], errors='coerce')
            
            self.df = df # Cache the dataframe for search/explorer APIs
            
            # Product Stats
            product_counts = df['Product'].value_counts().head(5)
            by_product = [{"name": str(k), "value": int(v)} for k, v in product_counts.items()]

            # Monthly Stats
            df['Month'] = df['Date received'].dt.strftime('%b %Y') # e.g. Jun 2025
            
            # Sort chronologically, take last 6 months
            month_counts = df.groupby('Month').size().reset_index(name='complaints')
            month_counts['date_sort'] = pd.to_datetime(month_counts['Month'], format='%b %Y')
            month_counts = month_counts.sort_values('date_sort').tail(6)
            
            # Count resolved (Closed)
            resolved_mask = df['Company response to consumer'].str.contains('Closed', na=False, case=False)
            resolved_counts = df[resolved_mask].groupby('Month').size().reset_index(name='resolved')
            
            monthly = pd.merge(month_counts, resolved_counts, on='Month', how='left').fillna(0)
            
            by_month = [
                {
                    "month": str(row['Month']).split(' ')[0], # Just short month name
                    "complaints": int(row['complaints']), 
                    "resolved": int(row['resolved'])
                } 
                for _, row in monthly.iterrows()
            ]

            # Top Issues
            issue_counts = df['Issue'].value_counts().head(5)
            top_issues = [{"issue": str(k), "count": int(v)} for k, v in issue_counts.items()]

            # Top Companies
            company_counts = df['Company'].value_counts().head(5)
            top_companies = [{"company": str(k), "count": int(v)} for k, v in company_counts.items()]

            # Narrative Stats
            total = len(df)
            has_narrative = df['Consumer complaint narrative'].notna().sum()
            avg_len = 0
            if has_narrative > 0:
                avg_len = int(df['Consumer complaint narrative'].dropna().str.len().mean())

            narrative_stats = {
                "total": int(total),
                "withNarrative": int(has_narrative),
                "avgLength": avg_len
            }

            self._cached_stats = {
                "byProduct": by_product,
                "byMonth": by_month,
                "topIssues": top_issues,
                "topCompanies": top_companies,
                "narrativeStats": narrative_stats
            }
            self._last_loaded = time.time()
            return self._cached_stats

        except Exception as e:
            print(f"Error computing stats: {e}")
            return self._get_fallback_stats()

    def get_stats(self):
        if not self._cached_stats:
            return self.load_and_compute()
        return self._cached_stats

    def _get_fallback_stats(self):
        return {
            "byProduct": [{"name": "Unknown", "value": 0}],
            "byMonth": [{"month": "Jan", "complaints": 0, "resolved": 0}],
            "topIssues": [{"issue": "Unknown", "count": 0}],
            "topCompanies": [{"company": "Unknown", "count": 0}],
            "narrativeStats": {"total": 0, "withNarrative": 0, "avgLength": 0}
        }

    def search_complaints(self, query: str = None, product: str = None, page: int = 1, limit: int = 50):
        if not hasattr(self, 'df') or self.df is None:
            return {"data": [], "total": 0, "page": page, "pages": 0}
            
        filtered = self.df.copy()
        
        if product:
            filtered = filtered[filtered['Product'] == product]
            
        if query:
            # Search in narrative or ID or company
            q = query.lower()
            mask = (
                filtered['Consumer complaint narrative'].str.lower().fillna('').str.contains(q) |
                filtered['Complaint ID'].astype(str).str.contains(q) |
                filtered['Company'].str.lower().fillna('').str.contains(q)
            )
            filtered = filtered[mask]
            
        total = len(filtered)
        start = (page - 1) * limit
        end = start + limit
        
        page_data = filtered.iloc[start:end]
        
        results = []
        for _, row in page_data.iterrows():
            results.append({
                "id": f"CFPB-{row['Complaint ID']}" if pd.notna(row['Complaint ID']) else "CFPB-0000",
                "product": str(row['Product']) if pd.notna(row['Product']) else "Unknown",
                "issue": str(row['Issue']) if pd.notna(row['Issue']) else "Unknown",
                "company": str(row['Company']) if pd.notna(row['Company']) else "Unknown",
                "state": str(row['State']) if pd.notna(row['State']) else "Unknown",
                "date": str(row['Date received'].strftime('%Y-%m-%d')) if pd.notna(row['Date received']) else "Unknown",
                "narrative": str(row['Consumer complaint narrative']) if pd.notna(row['Consumer complaint narrative']) else ""
            })
            
        return {
            "data": results,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit
        }

    def compare_products(self, productA: str, productB: str):
        if not hasattr(self, 'df') or self.df is None:
            return {"productA": {}, "productB": {}}
            
        def get_prod_stats(p):
            pdf = self.df[self.df['Product'] == p]
            top_issues = pdf['Issue'].value_counts().head(5)
            return {
                "name": p,
                "totalComplaints": len(pdf),
                "topIssues": [{"issue": str(k), "count": int(v)} for k, v in top_issues.items()]
            }
            
        return {
            "productA": get_prod_stats(productA),
            "productB": get_prod_stats(productB)
        }

    def get_trends(self):
        if not hasattr(self, 'df') or self.df is None:
            return {"trending": [], "timeline": []}
            
        # Get last 2 months for MoM comparison
        recent_months = self.df['Month'].drop_duplicates().tail(2).tolist()
        if len(recent_months) < 2:
            return {"trending": [], "timeline": []}
            
        prev_month, curr_month = recent_months[0], recent_months[1]
        
        curr_df = self.df[self.df['Month'] == curr_month]
        prev_df = self.df[self.df['Month'] == prev_month]
        
        curr_issues = curr_df['Issue'].value_counts().head(5)
        prev_issues = prev_df['Issue'].value_counts()
        
        trending = []
        for issue, count in curr_issues.items():
            prev_count = prev_issues.get(issue, 0)
            change = count - prev_count
            direction = "up" if change > 0 else ("down" if change < 0 else "stable")
            
            trending.append({
                "issue": str(issue),
                "direction": direction,
                "change": int(abs(change)),
                "count": int(count)
            })
            
        # Overall timeline
        timeline_df = self.df.groupby('Month').size().reset_index(name='count').tail(12)
        timeline = [{"date": str(row['Month']), "count": int(row['count'])} for _, row in timeline_df.iterrows()]
        
        return {
            "trending": trending,
            "timeline": timeline
        }
