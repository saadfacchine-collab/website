import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime, timedelta
import numpy as np

# Read the CSV file - only read first 5 columns to avoid comma issues
df = pd.read_csv('Fate_of_Chance_August_2023 Writing History.csv', usecols=[0, 1, 2, 3, 4])

# Convert Date column to datetime
df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')

# Sort by date
df = df.sort_values('Date').reset_index(drop=True)

# Get column names
col_names = df.columns.tolist()

# Convert the daily word change to numeric (column 3)
df['Daily Change'] = pd.to_numeric(df[col_names[3]], errors='coerce').fillna(0)

# Column 4 has the running total that you tracked
df['Tracked Total'] = pd.to_numeric(df[col_names[4]], errors='coerce')

# Create a new clean dataframe
clean_df = pd.DataFrame({
    'Date': df['Date'],
    'Daily Change': df['Daily Change'],
    'Tracked Total': df['Tracked Total']
})

# Use your tracked total where available, otherwise calculate cumulative
# Forward fill to handle the 0 at the end
clean_df['Cumulative'] = clean_df['Tracked Total'].replace(0, pd.NA).fillna(method='ffill')

# For the very beginning where there's no tracked total, use cumsum
if pd.isna(clean_df['Cumulative'].iloc[0]):
    first_valid_idx = clean_df['Cumulative'].first_valid_index()
    if first_valid_idx is not None:
        # Calculate cumsum up to first valid tracked value
        clean_df.loc[:first_valid_idx-1, 'Cumulative'] = clean_df.loc[:first_valid_idx-1, 'Daily Change'].cumsum()

# Replace df with clean_df
df = clean_df
df['Words (Total)'] = df['Daily Change']  # Keep for compatibility with existing code

# Ensure Cumulative is numeric
df['Cumulative'] = pd.to_numeric(df['Cumulative'], errors='coerce')

# Calculate gaps between sessions
df['Days Since Last'] = df['Date'].diff().dt.days

# Identify long breaks (30+ days)
df['Long Break'] = df['Days Since Last'] >= 30

# Create color gradient based on word count change
colors = ['#d32f2f' if x < 0 else '#1f6b6b' if x < 500 else '#2d7d7d' if x < 1000 else '#4a9999' for x in df['Words (Total)']]

# Create the main figure
fig = go.Figure()

# Add the main line showing cumulative word count
fig.add_trace(
    go.Scatter(
        x=df['Date'],
        y=df['Cumulative'],
        name='Total Word Count',
        mode='lines',
        line=dict(color='#2d7d7d', width=3),
        fill='tozeroy',
        fillcolor='rgba(45, 125, 125, 0.1)',
        hovertemplate='<b>%{x|%B %d, %Y}</b><br>Total: %{y:,} words<br><extra></extra>'
    )
)

# Add red shaded regions for long breaks (30+ days)
break_periods = df[df['Long Break'] == True]
for idx, row in break_periods.iterrows():
    if idx > 0:
        prev_date = df.loc[idx-1, 'Date']
        curr_date = row['Date']
        days_gap = row['Days Since Last']
        
        # Add shaded rectangle for the break
        fig.add_shape(
            type="rect",
            x0=prev_date,
            x1=curr_date,
            y0=0,
            y1=df['Cumulative'].max() * 1.1,
            fillcolor="rgba(211, 47, 47, 0.15)",
            layer="below",
            line_width=0,
        )
        
        # Add annotation for the break
        fig.add_annotation(
            x=prev_date + (curr_date - prev_date) / 2,
            y=df['Cumulative'].max() * 0.95,
            text=f"📅 {int(days_gap)} day break",
            showarrow=False,
            font=dict(size=9, color='#d32f2f', family='Source Sans Pro, sans-serif'),
            bgcolor="rgba(255, 255, 255, 0.8)",
            bordercolor="#d32f2f",
            borderwidth=1,
            borderpad=3
        )

# Find major drops (revision sessions where >1000 words were cut)
major_cuts = df[df['Words (Total)'] < -1000].copy()

# Add annotations for major revision sessions
for idx, row in major_cuts.iterrows():
    fig.add_annotation(
        x=row['Date'],
        y=row['Cumulative'],
        text=f"✂️ Cut {abs(row['Words (Total)']):,} words",
        showarrow=True,
        arrowhead=2,
        arrowcolor='#d32f2f',
        ax=40,
        ay=-30,
        font=dict(size=9, color='#d32f2f', family='Source Sans Pro, sans-serif'),
        bgcolor="rgba(255, 255, 255, 0.9)",
        bordercolor="#d32f2f",
        borderwidth=1,
        borderpad=3
    )

# Find the peak
peak_idx = df['Cumulative'].idxmax()
peak_row = df.loc[peak_idx]

# Add annotation for peak
fig.add_annotation(
    x=peak_row['Date'],
    y=peak_row['Cumulative'],
    text=f"📈 Peak: {peak_row['Cumulative']:,.0f} words",
    showarrow=True,
    arrowhead=2,
    arrowcolor='#2d7d7d',
    ax=0,
    ay=-40,
    font=dict(size=11, color='#2d7d7d', family='Crimson Text, serif', weight='bold'),
    bgcolor="rgba(255, 255, 255, 0.9)",
    bordercolor="#2d7d7d",
    borderwidth=2,
    borderpad=4
)

# Get current word count
current_count = df['Cumulative'].iloc[-1]
peak_count = df['Cumulative'].max()
net_change = current_count - peak_count

# Update layout
fig.update_layout(
    title={
        'text': f'✍️ The Model Muslim: Writing Journey<br><sub>{df["Date"].min().strftime("%B %Y")} - {df["Date"].max().strftime("%B %Y")} • {len(df)} sessions • Current: {current_count:,.0f} words</sub>',
        'x': 0.5,
        'xanchor': 'center',
        'font': {'size': 24, 'family': 'Crimson Text, serif', 'color': '#2c2c2c'}
    },
    xaxis_title='Date',
    yaxis_title='Total Word Count',
    font=dict(family='Source Sans Pro, sans-serif', size=12),
    plot_bgcolor='white',
    paper_bgcolor='white',
    showlegend=False,
    height=700,
    xaxis=dict(
        showgrid=True,
        gridcolor='#f0f0f0',
        linecolor='#2c2c2c',
        linewidth=2
    ),
    yaxis=dict(
        showgrid=True,
        gridcolor='#f0f0f0',
        linecolor='#2c2c2c',
        linewidth=2,
        tickformat=','
    )
)

# Save as HTML
fig.write_html('writing_progress.html')

print("Enhanced plot saved as 'writing_progress.html'")
print(f"\n{'='*60}")
print(f"  THE MODEL MUSLIM - Writing Journey Stats")
print(f"{'='*60}")
print(f"  Current word count: {current_count:,.0f} words")
print(f"  Peak word count: {peak_count:,.0f} words")
print(f"  Net change from peak: {net_change:,.0f} words ({net_change/peak_count*100:.1f}%)")
print(f"  Total sessions: {len(df)}")
print(f"  Time period: {(df['Date'].max() - df['Date'].min()).days} days")
print(f"  Longest break: {df['Days Since Last'].max():.0f} days")
print(f"  Major revision sessions (>1k words cut): {len(major_cuts)}")
print(f"{'='*60}\n")

# Also show the plot
fig.show()

