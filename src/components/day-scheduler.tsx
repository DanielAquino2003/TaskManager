// ----------------------------------------------------------
// File: component/day-scheduler.tsx
// Author: Maximo Martin Moreno
// Description: Component that allows users to schedule their day by adding intervals of time and activities.
// ----------------------------------------------------------


'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock } from 'lucide-react'

type TimeInterval = {
  id: number;
  startTime: string;
  endTime: string;
  activity: string;
}

export function DaySchedulerWidget() {
  const [intervals, setIntervals] = useState<TimeInterval[]>(() => {
    // Initialize intervals from localStorage
    const savedIntervals = localStorage.getItem('intervals');
    return savedIntervals ? JSON.parse(savedIntervals) : [];
  });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [activity, setActivity] = useState('');

  // Save intervals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('intervals', JSON.stringify(intervals));
  }, [intervals]);

  const handleAddInterval = () => {
    if (startTime && endTime && activity) {
      const newInterval: TimeInterval = {
        id: Date.now(),
        startTime,
        endTime,
        activity,
      };
      setIntervals((prevIntervals) => [...prevIntervals, newInterval]);
      setStartTime('');
      setEndTime('');
      setActivity('');
    }
  };

  const handleDeleteInterval = (id: number) => {
    setIntervals((prevIntervals) => prevIntervals.filter((interval) => interval.id !== id));
  };

  return (
    <Card className="bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-6 w-6 text-orange-500" />
          Day Scheduler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex gap-2">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
              aria-label="Start Time"
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
              aria-label="End Time"
            />
          </div>
          <Input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Activity description"
            className="w-full bg-zinc-800 text-white border-zinc-700"
          />
          <div className="flex justify-center mt-2">
            <Button
              onClick={handleAddInterval}
              className="w-full max-w-xs bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base"
            >
              Add Interval
            </Button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden">
          <h3 className="text-white mb-2">Your Day Schedule:</h3>
          <ul className="text-zinc-400 space-y-2">
            {intervals.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((interval) => (
              <li key={interval.id} className="border-b border-zinc-700 py-2 flex justify-between items-center">
                <span>
                  {interval.startTime} - {interval.endTime}: {interval.activity}
                </span>
                <Button
                  onClick={() => handleDeleteInterval(interval.id)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
