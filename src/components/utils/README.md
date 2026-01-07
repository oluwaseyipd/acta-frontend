# Scroll-to-Top Utilities

This directory contains utilities for managing scroll behavior in your React application.

## Components

### ScrollToTop

A component that automatically scrolls to the top of the page whenever the route changes.

**Usage:**
```tsx
import ScrollToTop from '@/components/utils/ScrollToTop';

// Place it inside your Router (already configured in App.tsx)
<BrowserRouter>
  <ScrollToTop />
  {/* Your routes */}
</BrowserRouter>
```

**Features:**
- Automatically triggers on route changes
- Uses smooth scrolling behavior
- No props required - works out of the box

### BackToTopButton

A floating button that appears when the user scrolls down and allows them to return to the top of the page.

**Usage:**
```tsx
import BackToTopButton from '@/components/utils/BackToTopButton';

// Place anywhere in your app (already configured in App.tsx)
<BackToTopButton />
```

**Features:**
- Only appears after scrolling 300px down
- Smooth entrance/exit animations with Framer Motion
- Accessible with screen reader support
- Styled with your design system (shadcn/ui)
- Fixed position in bottom-right corner

## Hooks

### useScrollToTop

A custom hook for more granular control over scroll-to-top behavior.

**Usage:**
```tsx
import { useScrollToTop } from '@/hooks/useScrollToTop';

// Basic usage - auto scroll to top
const Component = () => {
  useScrollToTop();
  return <div>Content</div>;
};

// Advanced usage with options
const Component = () => {
  const { scrollToTop } = useScrollToTop({
    auto: false,        // Don't auto-scroll
    smooth: true,       // Use smooth scrolling
    delay: 100,         // Wait 100ms before scrolling
    dependencies: [id]  // Scroll when 'id' changes
  });

  return (
    <div>
      <button onClick={scrollToTop}>Go to top</button>
    </div>
  );
};
```

**Options:**
- `smooth` (boolean): Whether to use smooth scrolling (default: true)
- `auto` (boolean): Whether to scroll automatically (default: true)
- `delay` (number): Delay before scrolling in milliseconds (default: 0)
- `dependencies` (array): Array of dependencies to trigger scroll (default: [])

## How It's Configured

The scroll-to-top functionality is automatically enabled in your app through `App.tsx`:

```tsx
<BrowserRouter>
  <ScrollToTop />              {/* Auto-scroll on route changes */}
  <Routes>
    {/* Your routes */}
  </Routes>
  <BackToTopButton />          {/* Manual scroll button */}
</BrowserRouter>
```

## Customization

### BackToTopButton Styling
The button uses your existing design system classes and can be customized by modifying the component:
- Position: `bottom-8 right-8`
- Appearance threshold: 300px scroll
- Animation: Framer Motion fade + scale

### ScrollToTop Behavior
The automatic scroll behavior can be modified in the `ScrollToTop` component:
- Change `behavior` from "smooth" to "auto" for instant scrolling
- Adjust scroll position by modifying the `top` and `left` values

## Browser Compatibility

These utilities use the `window.scrollTo()` API with smooth behavior, which is supported in:
- Chrome 61+
- Firefox 36+
- Safari 14+
- Edge 79+

For older browsers, it will fall back to instant scrolling.