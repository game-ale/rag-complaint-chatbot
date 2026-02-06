"use client"

import { PageTransition } from "@/components/PageTransition"
import { Card } from "@/components/ui/card"
import { AlertTriangle, FileText, TrendingUp, Users } from "lucide-react"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

const categoryData = [
    { name: "Credit card", value: 4500 },
    { name: "Debt collection", value: 3200 },
    { name: "Mortgages", value: 2800 },
    { name: "Bank account", value: 2100 },
    { name: "Credit reporting", value: 1800 }
]

const trendData = [
    { week: "W1", complaints: 400, resolved: 320 },
    { week: "W2", complaints: 600, resolved: 480 },
    { week: "W3", complaints: 550, resolved: 510 },
    { week: "W4", complaints: 800, resolved: 650 },
    { week: "W5", complaints: 950, resolved: 890 },
    { week: "W6", complaints: 1100, resolved: 980 }
]

const issueData = [
    { issue: "Billing", count: 1200 },
    { issue: "Privacy", count: 900 },
    { issue: "Customer Service", count: 850 },
    { issue: "Interest", count: 600 },
    { issue: "Fees", count: 400 }
]

const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"]

export default function Analytics() {
    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Market Analytics</h1>
                    <p className="text-muted-foreground text-lg">System-wide complaint distribution and macro-trends.</p>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Narratives", value: "15,482", icon: FileText, trend: "+12%" },
                        { label: "Critical Friction", value: "842", icon: AlertTriangle, trend: "-5%" },
                        { label: "Affected Users", value: "125k", icon: Users, trend: "+3%" },
                        { label: "Resolution Alpha", value: "0.92", icon: TrendingUp, trend: "Stable" }
                    ].map((kpi, i) => (
                        <Card key={i} className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/50 bg-card/30 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <kpi.icon className="h-12 w-12 text-primary" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{kpi.label}</p>
                            <h3 className="text-3xl font-black text-foreground">{kpi.value}</h3>
                            <div className="mt-2 flex items-center gap-1.5">
                                <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full",
                                    kpi.trend.startsWith("+") ? "bg-green-500/10 text-green-500" :
                                        kpi.trend.startsWith("-") ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                                )}>
                                    {kpi.trend}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">vs last month</span>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Trend Chart */}
                    <Card className="lg:col-span-8 p-8 border-border/50 bg-card/50 backdrop-blur-sm">
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Complaint Intensity Trend</h3>
                                <p className="text-sm text-muted-foreground">Volume vs Resolved delta over 6 weeks</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Complaints</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Resolutions</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                    <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#000000", border: "none", color: "#fff", borderRadius: "12px", fontSize: "12px" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Area type="monotone" dataKey="complaints" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
                                    <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRes)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Category Distribution */}
                    <Card className="lg:col-span-4 p-8 border-border/50 bg-card/50 backdrop-blur-sm">
                        <h3 className="text-xl font-bold tracking-tight mb-2">Category Split</h3>
                        <p className="text-sm text-muted-foreground mb-8">Product specific friction %</p>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-6">
                            {categoryData.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                        <span className="text-[11px] font-bold text-foreground">{item.name}</span>
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground">{((item.value / 14400) * 100).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Issue Breakdown */}
                    <Card className="lg:col-span-12 p-8 border-border/50 bg-card/50 backdrop-blur-sm">
                        <h3 className="text-xl font-bold tracking-tight mb-6">Common Grievance Vectors</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={issueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                    <XAxis dataKey="issue" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: '#88888810' }} />
                                    <Bar dataKey="count" fill="url(#colorComp)" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </PageTransition>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
