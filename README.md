VS Code Claude Sonnet 3.5


# Build a Responsive HTML/CSS/JS UI for an AI Image and Video creation App

## Overview
Create a text-to-video and text to image AI web app using vanilla HTML, CSS, and JavaScript only (no frameworks). The focus should be on responsive design, clean architecture, and clear integration points for future API connections.

## Core Requirements

### 1. General appearance
The app will appear very similar to http://pollo.ai 
It will have a black background and consist of three vertical sections.
The first panel will have links to features of the web site.  At this stage, we will just have links to Image to Video and Text to Video.
The second panel will have the options of the link chosen in the first panel.
If Image to Video is chosen from the first panel, then the second panel will appear as:
Title: Image to Video
Model: Dropdown list of image models
Image: Upload button that when clicked will enable upload from the local computer of an image.
Prompt: Multi linke text box.  Character counter (suggest 500 character limit)

Create button to commence creation.

If Text to Video is chosen from the first panel, then the second panel will appear as:
Title: Text to Video
Model: Dropdown list of image models
Prompt: Multi linke text box.  Character counter (suggest 500 character limit)

Create button to commence creation.

The third panel will be the video display area.
It will be a video player and include basic video controls (play/pause, volume, fullscreen)


### 5. Interactive Features
- **Loading states**: Spinner animation during "generation"
- **Form validation**: Prevent empty prompt submission
- **Responsive behavior**: Collapse/stack on mobile
- **Keyboard shortcuts**: Enter to submit (with Ctrl+Enter)

## Technical Specifications

### Code Quality
- **Modular JavaScript**: Separate concerns (UI, data, simulation)
- **CSS custom properties**: For theming and consistency
- **Semantic HTML**: Proper accessibility attributes

### Responsive Design
- **Mobile-first approach** with breakpoints at:
  - 320px (mobile)
  - 768px (tablet) 
  - 1024px (desktop)
- **Flexible grid system** using CSS Grid/Flexbox
- **Touch-friendly** button sizes (44px minimum)

### Performance
- **Optimized assets**: Compressed images, minified placeholder content
- **Lazy loading**: For history thumbnails
- **Efficient DOM manipulation**: Minimal reflows/repaints

## Design Direction

### Visual Style
Inspired by these modern AI interfaces:
- [Pollo.ai] (http://pollo.ai) - to follow this design as much as possible.
- [InVideo AI](https://ai.invideo.io/) - Clean layout, prominent video player
- [HIX.AI](https://hix.ai/text-to-video) - Input-focused design
- [v0.dev](https://v0.dev/) - Sharp typography, clear hierarchy

### UI Components
Reference [21st.dev](https://21st.dev/) for:
- Button styles and hover states
- Form input design
- Card layouts for history items

### Color Scheme
- **Primary**: Modern purple/blue gradient
- **Neutral**: Clean grays for text and backgrounds  
- **Accent**: Vibrant color for CTAs and success states
- **Dark mode ready**: CSS custom properties for theme switching

## Simulation Behavior

### Generate Button Action
When clicked, simulate a realistic workflow:
1. Validate prompt input
2. Show loading state (2-3 seconds)
3. "Generate" new placeholder video
4. Add entry to history
5. Reset form to ready state

### Error Handling
- Empty prompt validation
- Network timeout simulation
- Graceful failure messages

## File Structure
```
index.html          # Main page structure
styles/
  ├── main.css      # Core styles and layout
  ├── components.css # Reusable UI components
  └── responsive.css # Media queries
scripts/
  ├── app.js        # Main application logic
  ├── ui.js         # DOM manipulation helpers
  └── data.js       # Mock data and state management
assets/
  ├── videos/       # Placeholder video files
  └── images/       # Icons, thumbnails, etc.
```

## Future-Proofing Notes
- **API Integration Points**: Clear comments marking where real API calls will replace mock functions
- **State Management**: Simple but scalable state structure
- **Error Boundaries**: Framework for handling API failures
- **Configuration**: Easy way to swap model lists, endpoints, etc.

## Success Criteria
✅ **Responsive**: Looks great on mobile and desktop  
✅ **Interactive**: All buttons and forms work as expected  
✅ **Accessible**: Proper ARIA labels and keyboard navigation  
✅ **Maintainable**: Clean, commented code with clear structure  
✅ **Realistic**: Feels like a real app, not just a demo

---

**Deliverable**: Single HTML file with embedded CSS/JS, or organized file structure as outlined above. Include detailed README with setup instructions and architectural notes.