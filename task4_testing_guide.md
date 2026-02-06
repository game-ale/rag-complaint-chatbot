# Task 4: Manual Testing Guide

## Prerequisites
- Backend API running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`

## Test Scenarios

### 1. Basic Question-Answer Flow

**Steps**:
1. Open `http://localhost:3000` in your browser
2. In the textarea, type: "What are the main issues with credit cards?"
3. Click the "Ask" button
4. Wait for the response (20-30 seconds)

**Expected Result**:
- Loading spinner appears
- Answer panel displays with AI-generated response
- Sources section shows 5 complaint cards
- Each source card shows:
  - Product badge (e.g., "Credit card")
  - Company name
  - Complaint ID

### 2. Source Expansion

**Steps**:
1. After receiving an answer, scroll to the Sources section
2. Click "Expand" on the first source card

**Expected Result**:
- Full complaint text appears
- Text is readable and properly formatted
- "Collapse" button appears

### 3. Product Filtering (Optional)

**Steps**:
1. Modify the API request in `ui/lib/api.ts` to include filters:
```typescript
filters: { product: "Credit card" }
```
2. Ask a question

**Expected Result**:
- Only credit card complaints appear in sources

### 4. Error Handling

**Steps**:
1. Stop the backend API server
2. Try asking a question

**Expected Result**:
- Error message appears in red box
- UI doesn't crash
- Button re-enables after error

### 5. Empty Input Validation

**Steps**:
1. Leave the textarea empty
2. Try clicking "Ask"

**Expected Result**:
- Button is disabled
- No API call is made

## Screenshots to Capture

1. **Initial State**: Empty interface with input box
2. **Loading State**: Spinner while processing
3. **Answer Display**: Full answer with sources collapsed
4. **Expanded Source**: One source card expanded showing full text
5. **Error State**: Error message displayed

## Performance Checks

- [ ] UI loads in < 2 seconds
- [ ] No console errors in browser DevTools
- [ ] Answer appears within 30 seconds
- [ ] Smooth scrolling to sources
- [ ] Responsive layout (try resizing window)

## API Verification

Test the backend directly:
```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are credit card fees?", "filters": {"product": "Credit card"}}'
```

Expected: JSON response with `answer` and `sources` array.

## Troubleshooting

### UI won't load
- Check `npm run dev` is running without errors
- Verify `http://localhost:3000` is accessible
- Check browser console for errors

### API errors
- Verify backend is running: `curl http://localhost:8000/`
- Check CORS settings in `src/api.py`
- Verify `.env.local` has correct API URL

### Slow responses
- Normal for CPU-based FLAN-T5 (20-25s)
- Check backend logs for progress
- Ensure vector store is loaded

## Success Criteria

✅ User can ask questions
✅ AI responds with grounded answers
✅ Sources are visible and expandable
✅ UI handles errors gracefully
✅ No TypeScript compilation errors
✅ Clean, professional appearance
