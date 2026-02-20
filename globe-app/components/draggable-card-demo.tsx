import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export default function DraggableCardDemo() {
  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-clip">
      <DraggableCardBody>
        <img
          src="https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=3634&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Some mountains"
          className="pointer-events-none relative z-10 h-80 w-full object-cover"
        />
        <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
          Switzerland
        </p>
      </DraggableCardBody>
    </DraggableCardContainer>
  );
}
