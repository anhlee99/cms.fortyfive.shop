"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

function SidePanel({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="side-panel" {...props} />;
}

function SidePanelTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="side-panel-trigger" {...props} />;
}

function SidePanelPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="side-panel-portal" {...props} />;
}

function SidePanelClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="side-panel-close" {...props} />;
}

function SidePanelOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="side-panel-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function SidePanelContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <SidePanelPortal>
      <SidePanelOverlay />
      <DialogPrimitive.Content
        data-slot="side-panel-content"
        className={cn(
          "fixed inset-0 z-50 flex justify-end overflow-hidden",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
        )}
        {...props}
      >
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={80} minSize={25} maxSize={90}>
            <div className="h-full w-full" />
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="cursor-col-resize bg-border hover:bg-primary/50 transition-colors"
          />

          <ResizablePanel defaultSize={80} minSize={25} maxSize={90}>
            <div
              className={cn(
                "relative h-full bg-background p-6 border-l shadow-lg",
                className
              )}
            >
              {children}

              {showCloseButton && (
                <DialogPrimitive.Close
                  data-slot="side-panel-close"
                  className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogPrimitive.Content>
    </SidePanelPortal>
  );
}

function SidePanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="side-panel-header"
      className={cn("flex flex-col gap-2 mb-4", className)}
      {...props}
    />
  );
}

function SidePanelFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="side-panel-footer"
      className={cn(
        "flex flex-col gap-2 mt-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function SidePanelTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="side-panel-title"
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function SidePanelDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="side-panel-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  SidePanel,
  SidePanelClose,
  SidePanelContent,
  SidePanelDescription,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelOverlay,
  SidePanelPortal,
  SidePanelTitle,
  SidePanelTrigger,
};
