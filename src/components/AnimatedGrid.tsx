import React, { Component } from 'react';
import { randomColor } from '../utils/randomColor';

interface GridState {
  columns: number;
  rows: number;
  total: number;
}

interface AnimationState {
  isAnimating: boolean;
  currentAnimationId: number;
}

class AnimatedGrid extends Component<{}, GridState> {
  private gridRef = React.createRef<HTMLDivElement>();
  private animationTimeouts: Set<number> = new Set();
  private animationId = 0;

  state: GridState = {
    columns: 0,
    rows: 0,
    total: 1
  };

  handleStagger = (clickedIndex: number) => {
    console.log('Stagger animation triggered for index:', clickedIndex);
    const { columns } = this.state;
    
    if (!this.gridRef.current) return;
    
    // Clear any existing animations
    this.clearAllAnimations();
    
    // Increment animation ID to track this new animation
    this.animationId++;
    const currentAnimationId = this.animationId;
    
    const items = this.gridRef.current.querySelectorAll('.grid-item');
    
    // Create chromatic aberration colors (red, green, blue channels)
    const baseColor = randomColor();
    const redChannel = this.adjustColorChannel(baseColor, 'red', 1.4);
    const greenChannel = this.adjustColorChannel(baseColor, 'green', 1.2);
    const blueChannel = this.adjustColorChannel(baseColor, 'blue', 0.8);
    
    items.forEach((item, index) => {
      const clickedRow = Math.floor(clickedIndex / columns);
      const clickedCol = clickedIndex % columns;
      const itemRow = Math.floor(index / columns);
      const itemCol = index % columns;
      
      const distance = Math.abs(itemRow - clickedRow) + Math.abs(itemCol - clickedCol);
      const baseDelay = distance * 30; // Faster ripple
      
      // Create ripple effect with chromatic aberration
      const rippleDuration = 800; // ms
      const fadeDuration = 400; // ms
      
      // Red channel (fastest)
      const redTimeout = setTimeout(() => {
        if (currentAnimationId === this.animationId) {
          this.animateRipple(item as HTMLElement, redChannel, baseDelay, rippleDuration, fadeDuration, currentAnimationId);
        }
      }, baseDelay);
      this.animationTimeouts.add(redTimeout);
      
      // Green channel (medium)
      const greenTimeout = setTimeout(() => {
        if (currentAnimationId === this.animationId) {
          this.animateRipple(item as HTMLElement, greenChannel, baseDelay + 50, rippleDuration, fadeDuration, currentAnimationId);
        }
      }, baseDelay + 50);
      this.animationTimeouts.add(greenTimeout);
      
      // Blue channel (slowest)
      const blueTimeout = setTimeout(() => {
        if (currentAnimationId === this.animationId) {
          this.animateRipple(item as HTMLElement, blueChannel, baseDelay + 100, rippleDuration, fadeDuration, currentAnimationId);
        }
      }, baseDelay + 100);
      this.animationTimeouts.add(blueTimeout);
    });
  };

  adjustColorChannel = (color: string, channel: 'red' | 'green' | 'blue', factor: number): string => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    let newR = r, newG = g, newB = b;
    
    switch (channel) {
      case 'red':
        newR = Math.min(255, Math.floor(r * factor));
        newG = Math.max(0, Math.floor(g * 0.7)); // Reduce other channels
        newB = Math.max(0, Math.floor(b * 0.7));
        break;
      case 'green':
        newR = Math.max(0, Math.floor(r * 0.7));
        newG = Math.min(255, Math.floor(g * factor));
        newB = Math.max(0, Math.floor(b * 0.7));
        break;
      case 'blue':
        newR = Math.max(0, Math.floor(r * 0.7));
        newG = Math.max(0, Math.floor(g * 0.7));
        newB = Math.min(255, Math.floor(b * factor));
        break;
    }
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  clearAllAnimations = () => {
    // Clear all existing timeouts
    this.animationTimeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.animationTimeouts.clear();
    
    // Reset all grid items to their default state
    if (this.gridRef.current) {
      const items = this.gridRef.current.querySelectorAll('.grid-item');
      items.forEach((item) => {
        const element = item as HTMLElement;
        element.style.backgroundColor = '#fff';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
        element.style.transition = 'opacity 0.2s ease, background-color 0.3s ease, transform 0.3s ease';
      });
    }
  };

  animateRipple = (element: HTMLElement, color: string, delay: number, duration: number, fadeDuration: number, animationId: number) => {
    // Only proceed if this is still the current animation
    if (animationId !== this.animationId) return;
    
    // Set initial color with subtle scale effect
    element.style.backgroundColor = color;
    element.style.transform = 'scale(1.05)';
    element.style.transition = `background-color ${duration}ms ease-out, opacity ${fadeDuration}ms ease-out, transform ${duration}ms ease-out`;
    
    // Create ripple effect with opacity
    element.style.opacity = '0.9';
    
    // Fade out after peak
    const fadeTimeout = setTimeout(() => {
      if (animationId === this.animationId) {
        element.style.opacity = '0.3';
        element.style.transform = 'scale(0.98)';
      }
    }, delay + duration / 2);
    this.animationTimeouts.add(fadeTimeout);
    
    // Reset to white
    const resetTimeout = setTimeout(() => {
      if (animationId === this.animationId) {
        element.style.backgroundColor = '#fff';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }
    }, delay + duration);
    this.animationTimeouts.add(resetTimeout);
  };

  getGridSize = () => {
    const columns = Math.floor(window.innerWidth / 50);
    const rows = Math.floor(window.innerHeight / 50);
    const total = rows * columns;

    console.log('Grid size calculated:', columns, 'x', rows, '=', total);

    this.setState({ columns, rows, total });
    
    // Reset colors after state update
    setTimeout(() => {
      if (this.gridRef.current) {
        const items = this.gridRef.current.querySelectorAll('.grid-item');
        items.forEach((item) => {
          (item as HTMLElement).style.backgroundColor = '#fff';
        });
      }
    }, 100);
  };

  componentDidMount() {
    console.log('AnimatedGrid mounted');
    this.getGridSize();
    window.addEventListener("resize", this.getGridSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getGridSize);
    this.clearAllAnimations();
  }

  render() {
    const { total } = this.state;
    console.log('Rendering grid with', total, 'items');
    
    return (
      <div 
        id="grid" 
        ref={this.gridRef}
        style={{ 
          width: '100vw',
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
          gridTemplateRows: 'repeat(auto-fit, minmax(50px, 1fr))',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}
      >
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className="grid-item"
            data-index={i}
            style={{
              minWidth: '100%',
              minHeight: '100%',
              backgroundColor: '#fff',
              cursor: 'pointer',
              position: 'relative',
              transition: 'opacity 0.2s ease, background-color 0.3s ease, transform 0.3s ease',
              pointerEvents: 'auto',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              console.log('Mouse enter on item', i);
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              console.log('Mouse leave on item', i);
              e.currentTarget.style.opacity = '1';
            }}
            onClick={(e) => {
              console.log('Click on item', i);
              e.preventDefault();
              e.stopPropagation();
              this.handleStagger(i);
            }}
          >
            <div
              style={{
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                outline: '1px solid rgba(202, 202, 202, 0.46)',
                display: 'block',
                pointerEvents: 'none'
              }}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default AnimatedGrid;