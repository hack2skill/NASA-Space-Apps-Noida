!pip install pmdarima

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt
import datetime as dt
from scipy.stats import pearsonr
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.stattools import adfuller
import pmdarima as pm
from statsmodels.tsa.arima.model import ARIMA

from learntools.time_series.style import *

import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))

    
temperatures = pd.read_csv('./GlobalTemperatures.csv')
temperatures.index = pd.to_datetime(temperatures.dt, format='%Y-%d-%m')
temperatures = temperatures.drop(columns=['dt'])

temperatures.head()

temperatures=temperatures[['LandAverageTemperature']]

temperatures.describe()

max(temperatures.index)

temperatures.dtypes

temperatures.describe()

plt.figure(figsize=(18,10))
plt.plot(temperatures['LandAverageTemperature'])
plt.show()

temperatures['Year'] = temperatures.index.year

yearly_data = temperatures['LandAverageTemperature'].asfreq('Y')
yearly_mean = yearly_data.resample('Y').mean()

df = temperatures.resample('Y').mean()

plt.figure(figsize=(18,10))
plt.plot(df['LandAverageTemperature'])
plt.show()

import matplotlib.animation as animation

oneYearData = df.iloc[0:365,:]
x = oneYearData.index
y = oneYearData['LandAverageTemperature']

fig, ax = plt.subplots()
line, = ax.plot(x, y, "b-")

def animate(i):
    print("animating")
    oneYearData= df.iloc[i*365:i*365+365, :]
    x = oneYearData.index
    y = oneYearData['LandAverageTemperature']

    # Update the y-data of the line plot by shifting the sine wave horizontally
    # line.set_xdata(x)
    line.set_ydata(y)
    return line,

ani = animation.FuncAnimation(fig, animate, interval=10, blit=True, save_count=50)
plt.show()

import matplotlib.pyplot as plt
import numpy as np
import matplotlib.animation as animation

# Create a figure and axis for the plot
fig, ax = plt.subplots()

# Generate x values from 0 to 2*pi with a step of 0.01
x = np.arange(0, 2 * np.pi, 0.01)

# Create a line plot of y = sin(x)
line, = ax.plot(x, np.sin(x))

# Define the animate function
def animate(i):
    line.set_ydata(np.sin(x + i / 50))
    return line,

# Create a FuncAnimation object
ani = animation.FuncAnimation(fig, animate, interval=20, blit=True, save_count=50)

# Display the animation in a Matplotlib window
plt.show()

decomposition = seasonal_decompose(df['LandAverageTemperature'], model='multiplicative', period=10)
fig = decomposition.plot()

temperature_px = df['LandAverageTemperature']
df['10'] = temperature_px.rolling(window=10).mean()

plt.figure(figsize=(18,10))
ax = plt.subplot()
ax.plot(df['LandAverageTemperature'], alpha=0.8, label='land average temperature')
ax.plot(df['10'], color="orange", label='10-year land average temperature')
ax.set_xticks([0,50,100,150,200,250])
ax.set_xticklabels([1750,1800,1850,1900,1950,2000])
plt.xlabel('Years')
plt.ylabel('Temperature (in °C)')
plt.grid()
plt.legend()
plt.show()
plt.clf()

ax = df['LandAverageTemperature'].plot(**plot_params)
ax.set(title="Land Average Temperature per Year in the last 250 years", ylabel="Land Average Temperature")
plt.show()

trend = df['LandAverageTemperature'].rolling(
    window=10,
    center=True,
    min_periods=6,
).mean()

ax = df['LandAverageTemperature'].plot(**plot_params, alpha=0.5)
ax = trend.plot(ax=ax, linewidth=3)
ax.set(title="Land Average Temperature in the last 250 years", ylabel="Land Average Temperature")
plt.show()

from statsmodels.tsa.deterministic import DeterministicProcess

average_temperature = df['LandAverageTemperature']
y = average_temperature.copy()  # the target

# YOUR CODE HERE: Instantiate `DeterministicProcess` with arguments
# appropriate for a cubic trend model
dp = DeterministicProcess(index=y.index, order=3)
X = dp.in_sample()
X_fore = dp.out_of_sample(steps=90)

model = LinearRegression()
model.fit(X, y)

y_pred = pd.Series(model.predict(X), index=X.index)
y_fore = pd.Series(model.predict(X_fore), index=X_fore.index)

ax = y.plot(**plot_params, alpha=0.5, title="Average Land Temperature", ylabel="Land Temperature")
ax = y_pred.plot(ax=ax, linewidth=3, label="Trend", color='C0')
ax = y_fore.plot(ax=ax, linewidth=3, label="Trend Forecast", color='C3')
plt.xlabel('Year')
ax.legend();

