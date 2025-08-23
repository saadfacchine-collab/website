// US States Ripple Animation
// States light up in waves emanating from Kansas

class USRippleAnimation {
    constructor(containerId) {
        this.container = d3.select(containerId);
        this.width = 800;
        this.height = 500;
        this.states = [];
        this.animationQueue = [];
        this.isAnimating = false;
        
        this.init();
    }
    
    async init() {
        // Create SVG container
        this.svg = this.container
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('background', '#1a1a1a');
        
        // Load US states GeoJSON
        await this.loadStates();
        this.createStates();
        this.calculateDistances();
    }
    
    async loadStates() {
        try {
            const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
            const us = await response.json();
            
            // Convert to GeoJSON format
            this.states = topojson.feature(us, us.objects.states).features.map(feature => ({
                id: feature.id,
                name: feature.properties.name,
                geometry: feature.geometry,
                distance: 0,
                delay: 0,
                fill: '#2a2a2a',
                stroke: '#444'
            }));
        } catch (error) {
            console.error('Error loading states:', error);
            // Fallback: create simple state shapes
            this.createFallbackStates();
        }
    }
    
    createFallbackStates() {
        // Simple rectangular states as fallback
        this.states = [
            { id: 'KS', name: 'Kansas', x: 400, y: 250, width: 80, height: 60, distance: 0, delay: 0, fill: '#2a2a2a' },
            { id: 'MO', name: 'Missouri', x: 450, y: 250, width: 70, height: 60, distance: 1, delay: 0.1, fill: '#2a2a2a' },
            { id: 'OK', name: 'Oklahoma', x: 350, y: 300, width: 80, height: 50, distance: 1, delay: 0.1, fill: '#2a2a2a' },
            { id: 'NE', name: 'Nebraska', x: 400, y: 180, width: 80, height: 60, distance: 1, delay: 0.1, fill: '#2a2a2a' },
            { id: 'CO', name: 'Colorado', x: 300, y: 200, width: 80, height: 80, distance: 2, delay: 0.2, fill: '#2a2a2a' },
            { id: 'IA', name: 'Iowa', x: 450, y: 180, width: 70, height: 60, distance: 2, delay: 0.2, fill: '#2a2a2a' },
            { id: 'AR', name: 'Arkansas', x: 400, y: 350, width: 70, height: 50, distance: 2, delay: 0.2, fill: '#2a2a2a' },
            { id: 'TX', name: 'Texas', x: 350, y: 400, width: 120, height: 80, distance: 3, delay: 0.3, fill: '#2a2a2a' },
            { id: 'NM', name: 'New Mexico', x: 250, y: 300, width: 80, height: 80, distance: 3, delay: 0.3, fill: '#2a2a2a' },
            { id: 'WY', name: 'Wyoming', x: 300, y: 120, width: 80, height: 80, distance: 3, delay: 0.3, fill: '#2a2a2a' },
            { id: 'MN', name: 'Minnesota', x: 450, y: 120, width: 80, height: 60, distance: 3, delay: 0.3, fill: '#2a2a2a' },
            { id: 'IL', name: 'Illinois', x: 500, y: 250, width: 70, height: 60, distance: 3, delay: 0.3, fill: '#2a2a2a' },
            { id: 'TN', name: 'Tennessee', x: 450, y: 350, width: 70, height: 50, distance: 3, delay: 0.3, fill: '#2a2a2a' },
            { id: 'LA', name: 'Louisiana', x: 400, y: 450, width: 70, height: 50, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'MS', name: 'Mississippi', x: 450, y: 400, width: 60, height: 50, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'AL', name: 'Alabama', x: 500, y: 400, width: 60, height: 50, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'GA', name: 'Georgia', x: 550, y: 400, width: 70, height: 50, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'FL', name: 'Florida', x: 550, y: 450, width: 60, height: 80, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'SC', name: 'South Carolina', x: 600, y: 400, width: 50, height: 50, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'NC', name: 'North Carolina', x: 600, y: 350, width: 60, height: 50, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'VA', name: 'Virginia', x: 600, y: 300, width: 60, height: 50, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'WV', name: 'West Virginia', x: 550, y: 300, width: 50, height: 50, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'KY', name: 'Kentucky', x: 500, y: 300, width: 60, height: 50, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'IN', name: 'Indiana', x: 500, y: 250, width: 60, height: 50, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'OH', name: 'Ohio', x: 550, y: 250, width: 60, height: 50, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'PA', name: 'Pennsylvania', x: 600, y: 250, width: 70, height: 50, distance: 6, delay: 0.6, fill: '#2a2a2a' },
            { id: 'NY', name: 'New York', x: 650, y: 200, width: 80, height: 80, distance: 7, delay: 0.7, fill: '#2a2a2a' },
            { id: 'ME', name: 'Maine', x: 700, y: 120, width: 60, height: 60, distance: 8, delay: 0.8, fill: '#2a2a2a' },
            { id: 'NH', name: 'New Hampshire', x: 700, y: 180, width: 40, height: 40, distance: 8, delay: 0.8, fill: '#2a2a2a' },
            { id: 'VT', name: 'Vermont', x: 700, y: 220, width: 40, height: 40, distance: 8, delay: 0.8, fill: '#2a2a2a' },
            { id: 'MA', name: 'Massachusetts', x: 700, y: 260, width: 50, height: 40, distance: 8, delay: 0.8, fill: '#2a2a2a' },
            { id: 'RI', name: 'Rhode Island', x: 750, y: 260, width: 30, height: 30, distance: 8, delay: 0.8, fill: '#2a2a2a' },
            { id: 'CT', name: 'Connecticut', x: 700, y: 300, width: 40, height: 40, distance: 8, delay: 0.8, fill: '#2a2a2a' },
            { id: 'NJ', name: 'New Jersey', x: 650, y: 280, width: 50, height: 40, distance: 7, delay: 0.7, fill: '#2a2a2a' },
            { id: 'DE', name: 'Delaware', x: 650, y: 320, width: 30, height: 30, distance: 7, delay: 0.7, fill: '#2a2a2a' },
            { id: 'MD', name: 'Maryland', x: 650, y: 350, width: 50, height: 40, distance: 7, delay: 0.7, fill: '#2a2a2a' },
            { id: 'DC', name: 'District of Columbia', x: 650, y: 390, width: 20, height: 20, distance: 7, delay: 0.7, fill: '#2a2a2a' },
            { id: 'WI', name: 'Wisconsin', x: 500, y: 120, width: 80, height: 60, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'MI', name: 'Michigan', x: 550, y: 120, width: 80, height: 80, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'MT', name: 'Montana', x: 250, y: 80, width: 100, height: 80, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'ND', name: 'North Dakota', x: 400, y: 80, width: 80, height: 40, distance: 4, delay: 0.4, fill: '#2a2a2a' },
            { id: 'SD', name: 'South Dakota', x: 400, y: 120, width: 80, height: 40, distance: 3, delay: 0.3, fill: '#2a2a2a' },
            { id: 'ID', name: 'Idaho', x: 200, y: 120, width: 80, height: 80, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'WA', name: 'Washington', x: 150, y: 80, width: 80, height: 80, distance: 6, delay: 0.6, fill: '#2a2a2a' },
            { id: 'OR', name: 'Oregon', x: 150, y: 160, width: 80, height: 80, distance: 6, delay: 0.6, fill: '#2a2a2a' },
            { id: 'CA', name: 'California', x: 100, y: 240, width: 80, height: 120, distance: 7, delay: 0.7, fill: '#2a2a2a' },
            { id: 'NV', name: 'Nevada', x: 200, y: 240, width: 80, height: 80, distance: 6, delay: 0.6, fill: '#2a2a2a' },
            { id: 'UT', name: 'Utah', x: 250, y: 240, width: 80, height: 80, distance: 5, delay: 0.5, fill: '#2a2a2a' },
            { id: 'AZ', name: 'Arizona', x: 200, y: 320, width: 80, height: 80, distance: 6, delay: 0.6, fill: '#2a2a2a' }
        ];
    }
    
    createStates() {
        if (this.states[0].geometry) {
            // Real GeoJSON states
            this.svg.selectAll('path')
                .data(this.states)
                .enter()
                .append('path')
                .attr('d', d3.geoPath().projection(d3.geoAlbersUsa().fitSize([this.width, this.height], {type: 'FeatureCollection', features: this.states})))
                .attr('fill', d => d.fill)
                .attr('stroke', d => d.stroke)
                .attr('stroke-width', 0.5)
                .attr('class', 'state')
                .attr('data-state', d => d.id);
        } else {
            // Fallback rectangular states
            this.svg.selectAll('rect')
                .data(this.states)
                .enter()
                .append('rect')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
                .attr('width', d => d.width)
                .attr('height', d => d.height)
                .attr('fill', d => d.fill)
                .attr('stroke', '#444')
                .attr('stroke-width', 1)
                .attr('class', 'state')
                .attr('data-state', d => d.id);
        }
    }
    
    calculateDistances() {
        // Calculate distance from Kansas for each state
        const kansasCenter = { x: 400, y: 250 }; // Approximate Kansas center
        
        this.states.forEach(state => {
            if (state.geometry) {
                // For real GeoJSON, calculate centroid
                const centroid = d3.geoCentroid(state);
                const projection = d3.geoAlbersUsa().fitSize([this.width, this.height], {type: 'FeatureCollection', features: this.states});
                const [x, y] = projection(centroid);
                state.centerX = x;
                state.centerY = y;
            } else {
                // For fallback states, use center
                state.centerX = state.x + state.width / 2;
                state.centerY = state.y + state.height / 2;
            }
            
            // Calculate distance from Kansas
            const dx = state.centerX - kansasCenter.x;
            const dy = state.centerY - kansasCenter.y;
            state.distance = Math.sqrt(dx * dx + dy * dy);
            
            // Convert distance to delay (0-1 seconds)
            state.delay = Math.min(state.distance / 200, 1.5);
        });
        
        // Sort states by distance for animation order
        this.states.sort((a, b) => a.distance - b.distance);
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        // Reset all states
        this.svg.selectAll('.state')
            .attr('fill', '#2a2a2a')
            .style('filter', 'none');
        
        // Animate each state based on distance from Kansas
        this.states.forEach((state, index) => {
            setTimeout(() => {
                this.animateState(state);
            }, state.delay * 1000);
        });
        
        // Complete animation after all states are done
        setTimeout(() => {
            this.isAnimating = false;
            this.onComplete && this.onComplete();
        }, 2000);
    }
    
    animateState(state) {
        const stateElement = this.svg.select(`[data-state="${state.id}"]`);
        
        // Create ripple effect
        stateElement
            .transition()
            .duration(800)
            .attr('fill', '#4CAF50') // Green fill
            .style('filter', 'drop-shadow(0 0 10px rgba(76, 175, 80, 0.6))');
        
        // Add ripple circle effect
        const ripple = this.svg.append('circle')
            .attr('cx', state.centerX)
            .attr('cy', state.centerY)
            .attr('r', 0)
            .attr('fill', 'none')
            .attr('stroke', '#4CAF50')
            .attr('stroke-width', 2)
            .attr('opacity', 0.8);
        
        ripple.transition()
            .duration(1000)
            .attr('r', 50)
            .attr('opacity', 0)
            .remove();
    }
    
    reset() {
        this.svg.selectAll('.state')
            .attr('fill', '#2a2a2a')
            .style('filter', 'none');
        
        this.svg.selectAll('circle').remove();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = USRippleAnimation;
}
