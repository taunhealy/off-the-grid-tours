"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useQueryState } from "nuqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { BikeType, DifficultyLevel } from "@prisma/client";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const bikeTypes = Object.values(BikeType);
const difficultyLevels = Object.values(DifficultyLevel);
const durationRanges = ["1-3", "4-7", "8-14", "15+"];

export default function TourFilters({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const [month, setMonth] = useQueryState("month");
  const [bikeType, setBikeType] = useQueryState("bikeType");
  const [difficulty, setDifficulty] = useQueryState("difficulty");
  const [duration, setDuration] = useQueryState("duration");

  const handleReset = useCallback(() => {
    setMonth(null);
    setBikeType(null);
    setDifficulty(null);
    setDuration(null);
  }, [setMonth, setBikeType, setDifficulty, setDuration]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["month", "bikeType", "difficulty", "duration"]}
      >
        <AccordionItem value="month">
          <AccordionTrigger>Month</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {months.map((m) => (
                <div key={m} className="flex items-center space-x-2">
                  <Checkbox
                    id={`month-${m}`}
                    checked={month === m.toLowerCase()}
                    onCheckedChange={(checked) => {
                      setMonth(checked ? m.toLowerCase() : null);
                    }}
                  />
                  <Label htmlFor={`month-${m}`}>{m}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bikeType">
          <AccordionTrigger>Bike Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {bikeTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bike-${type}`}
                    checked={bikeType === type}
                    onCheckedChange={(checked) => {
                      setBikeType(checked ? type : null);
                    }}
                  />
                  <Label htmlFor={`bike-${type}`}>
                    {type
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="difficulty">
          <AccordionTrigger>Difficulty Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {difficultyLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${level}`}
                    checked={difficulty === level}
                    onCheckedChange={(checked) => {
                      setDifficulty(checked ? level : null);
                    }}
                  />
                  <Label htmlFor={`difficulty-${level}`}>
                    {level
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration">
          <AccordionTrigger>Duration (days)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {durationRanges.map((range) => (
                <div key={range} className="flex items-center space-x-2">
                  <Checkbox
                    id={`duration-${range}`}
                    checked={duration === range}
                    onCheckedChange={(checked) => {
                      setDuration(checked ? range : null);
                    }}
                  />
                  <Label htmlFor={`duration-${range}`}>
                    {range === "15+" ? "15+ days" : `${range} days`}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
