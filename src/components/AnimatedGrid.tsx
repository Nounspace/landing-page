import React, { Component } from 'react';
import { randomColor } from '../utils/randomColor';

interface GridState {
  columns: number;
  rows: number;
  total: number;
}

class AnimatedGrid extends Component<{}, GridState> {
  private gridRef = React.createRef<HTMLDivElement>();

  state: GridState = {
    columns: 0,
    rows: 0,
    total: 1
  };

  handleStagger = (clickedIndex: number) => {
    console.log('Stagger animation triggered for index:', clickedIndex);
    const { columns } = this.state;
    const color = randomColor();
    
    if (!this.gridRef.current) return;
    
    const items = this.gridRef.current.querySelectorAll('.grid-item');
    
    items.forEach((item, index) => {
      const clickedRow = Math.floor(clickedIndex / columns);
      const clickedCol = clickedIndex % columns;
      const itemRow = Math.floor(index / columns);
      const itemCol = index % columns;
      
      const distance = Math.abs(itemRow - clickedRow) + Math.abs(itemCol - clickedCol);
      const delay = distance * 50;
      
      setTimeout(() => {
        (item as HTMLElement).style.backgroundColor = color;
      }, delay);
    });
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
              transition: 'opacity 0.2s ease, background-color 0.3s ease',
              pointerEvents: 'auto'
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
                outline: '1px solid black',
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