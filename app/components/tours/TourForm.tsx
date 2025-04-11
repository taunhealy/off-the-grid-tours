"use client";

import { useState, useEffect } from "react";
import { Tour } from "@/app/types/tour";
import { DifficultyLevel } from "@prisma/client";

const difficultyOptions = [
  { value: "EASY", label: "Easy" },
  { value: "MODERATE", label: "Moderate" },
  { value: "CHALLENGING", label: "Challenging" },
  { value: "EXTREME", label: "Extreme" },
];

const defaultFormData: Omit<Tour, "id"> = {
  name: "",
  description: "",
  difficulty: "MODERATE" as DifficultyLevel,
  duration: 1,
  distance: 0,
  startLocation: "",
  endLocation: "",
  maxParticipants: 10,
  basePrice: 0,
  published: false,
};

interface TourFormProps {
  initialData: Tour | null;
  onSubmit: (data: Omit<Tour, "id">) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function TourForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: TourFormProps) {
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        difficulty: initialData.difficulty,
        duration: initialData.duration,
        distance: initialData.distance,
        startLocation: initialData.startLocation,
        endLocation: initialData.endLocation,
        maxParticipants: initialData.maxParticipants,
        basePrice: initialData.basePrice,
        published: initialData.published,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    const name = target.name;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "difficulty"
          ? (value as DifficultyLevel)
          : name === "basePrice"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-primary">
      <div>
        <label htmlFor="name" className="label">
          Tour Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="input"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="difficulty" className="label">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="input"
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="label">
            Duration (days)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min={1}
            className="input"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="distance" className="label">
            Distance (km)
          </label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            min={0}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="maxParticipants" className="label">
            Max Participants
          </label>
          <input
            type="number"
            id="maxParticipants"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min={1}
            className="input"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startLocation" className="label">
            Start Location
          </label>
          <input
            type="text"
            id="startLocation"
            name="startLocation"
            value={formData.startLocation}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="endLocation" className="label">
            End Location
          </label>
          <input
            type="text"
            id="endLocation"
            name="endLocation"
            value={formData.endLocation}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="basePrice" className="label">
          Base Price ($)
        </label>
        <input
          type="number"
          id="basePrice"
          name="basePrice"
          value={
            typeof formData.basePrice === "object"
              ? formData.basePrice.toNumber()
              : formData.basePrice
          }
          onChange={handleChange}
          min={0}
          step={0.01}
          className="input"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          name="published"
          checked={formData.published}
          onChange={handleChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
          Publish Tour
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {initialData && (
          <button type="button" onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Tour"
            : "Create Tour"}
        </button>
      </div>
    </form>
  );
}
