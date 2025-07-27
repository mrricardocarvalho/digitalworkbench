# 🧪 Analytics System Test Instructions

## Testing the Performance Monitoring & Analytics System

### **Test 1: Performance Dashboard Access**
1. **Keyboard Shortcut Test**:
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - ✅ Performance Dashboard should open with real-time metrics

2. **Command Palette Test**:
   - Press `Cmd/Ctrl+K` to open Command Palette
   - Type "Performance Dashboard"
   - ✅ Should find and execute the command

### **Test 2: Console Analytics Logging**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Navigate around the site
4. ✅ Should see `[Analytics]` debug messages showing:
   - Page view tracking
   - User journey events
   - Performance metrics capture

### **Test 3: Article Engagement Tracking**
1. Navigate to any article (e.g., `/insights/exploring-secrettext-feature-business-central`)
2. Scroll through the article
3. Stay on page for 30+ seconds
4. ✅ Should see engagement tracking in console:
   - Reading time tracking
   - Scroll depth monitoring
   - Article view events

### **Test 4: Web Vitals Monitoring**
1. Open Performance Dashboard (`Ctrl+Shift+P`)
2. ✅ Should see real-time metrics:
   - CLS (Cumulative Layout Shift)
   - INP (Interaction to Next Paint)
   - FCP (First Contentful Paint)
   - LCP (Largest Contentful Paint)
   - TTFB (Time to First Byte)

### **Test 5: Error Tracking**
1. Open browser console
2. Force a JavaScript error (type `throw new Error('Test error')` in console)
3. ✅ Should see error captured and tracked with context

### **Test 6: Command Palette Analytics Features**
1. Press `Cmd/Ctrl+K` to open Command Palette
2. ✅ Available analytics commands:
   - "📊 Performance Dashboard"
   - "⚡ Quick Performance Check"
   - "📈 Track Current Page"

### **Expected Results**
- ✅ All features working without errors
- ✅ Debug logging visible in development mode
- ✅ Performance metrics updating in real-time
- ✅ User interactions being tracked
- ✅ Error handling functioning properly

### **Performance Dashboard Features**
- Real-time Web Vitals display
- Color-coded status indicators (Good/Needs Improvement/Poor)
- Auto-refresh every 5 seconds
- Performance budget violation alerts
- Responsive design for all screen sizes

---

**Status**: Ready for testing ✅
