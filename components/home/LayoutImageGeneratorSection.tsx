"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ImageIcon, AlertTriangle } from "lucide-react";

export default function LayoutImageGeneratorSection() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setImages([]);
    setError(null);

    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setError(error || "Failed to generate image.");
        setLoading(false);
        return;
      }
      const { urls } = await res.json();
      setImages(urls);
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="ai-image-generator"
      className="w-full max-w-3xl mx-auto flex flex-col items-center py-12 px-4 sm:px-8"
    >
      <h2 className="text-3xl font-extrabold text-center mb-2">AI Image Generator</h2>
      <p className="text-zinc-700 dark:text-zinc-300 text-center mb-6">
        Enter a prompt below and Pictofy will generate an image for you using OpenAI’s latest models.
      </p>
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Label htmlFor="prompt" className="font-semibold text-base">
          Image prompt
        </Label>
        <Input
          id="prompt"
          type="text"
          placeholder="Describe the image you want (e.g. 'A panda skateboarding in Times Square at sunset')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="text-base"
          maxLength={200}
        />
        <Button
          type="submit"
          className="mt-2 w-full"
          size="lg"
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" /> Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Generate Image
            </span>
          )}
        </Button>
      </form>
      {error && (
        <div className="flex items-center gap-2 text-red-600 mt-4">
          <AlertTriangle className="h-5 w-5" /> {error}
        </div>
      )}
      <div className="mt-8 w-full flex flex-col items-center">
        {images.length > 0 && (
          <div className="grid gap-6">
            {images.map((url, i) => (
              <Card
                key={url}
                className="overflow-hidden border shadow-lg max-w-md mx-auto"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Generated result ${i + 1}`}
                  className="w-full object-cover"
                  style={{ maxHeight: 384 }}
                />
                <div className="text-xs text-zinc-500 px-4 py-2 break-words">
                  Prompt: {prompt}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}