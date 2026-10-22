"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({
  className,
  ...props
}: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn(className)}
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  children,
  ...props
}: MenuPrimitive.Popup.Props & {
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  return (
    <DropdownMenuPortal>
      <MenuPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-[150]"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "min-w-[12rem] overflow-hidden rounded-xl border border-zinc-200 bg-white/95 p-1.5 text-zinc-950 shadow-xl backdrop-blur-md outline-none dark:border-white/10 dark:bg-zinc-950/95 dark:text-zinc-50",
            "data-[side=bottom]:animate-in data-[side=bottom]:fade-in-0 data-[side=bottom]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
            "data-[side=top]:animate-in data-[side=top]:fade-in-0 data-[side=top]:zoom-in-95 data-[side=top]:slide-in-from-bottom-2",
            "data-[side=right]:animate-in data-[side=right]:fade-in-0 data-[side=right]:zoom-in-95 data-[side=right]:slide-in-from-left-2",
            "data-[side=left]:animate-in data-[side=left]:fade-in-0 data-[side=left]:zoom-in-95 data-[side=left]:slide-in-from-right-2",
            className
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </DropdownMenuPortal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuItem({
  className,
  inset,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors",
        "hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900",
        "data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-900",
        "dark:hover:bg-white/10 dark:hover:text-zinc-50 dark:focus:bg-white/10 dark:focus:text-zinc-50 dark:data-[highlighted]:bg-white/10 dark:data-[highlighted]:text-zinc-50",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors",
        "hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900",
        "data-[highlighted]:bg-zinc-100 data-[highlighted]:text-zinc-900",
        "dark:hover:bg-white/10 dark:hover:text-zinc-50 dark:focus:bg-white/10 dark:focus:text-zinc-50 dark:data-[highlighted]:bg-white/10 dark:data-[highlighted]:text-zinc-50",
        "data-[open]:bg-zinc-100 dark:data-[open]:bg-white/10",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto size-4 opacity-60" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  sideOffset = 4,
  align = "start",
  children,
  ...props
}: MenuPrimitive.Popup.Props & {
  sideOffset?: number
  align?: "start" | "center" | "end"
}) {
  return (
    <DropdownMenuPortal>
      <MenuPrimitive.Positioner
        side="right"
        align={align}
        sideOffset={sideOffset}
        className="z-[160]"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-sub-content"
          className={cn(
            "min-w-[12rem] overflow-hidden rounded-xl border border-zinc-200 bg-white/95 p-1.5 text-zinc-950 shadow-2xl backdrop-blur-md outline-none dark:border-white/10 dark:bg-zinc-950/95 dark:text-zinc-50",
            "data-[side=right]:animate-in data-[side=right]:fade-in-0 data-[side=right]:zoom-in-95 data-[side=right]:slide-in-from-left-2",
            "data-[side=left]:animate-in data-[side=left]:fade-in-0 data-[side=left]:zoom-in-95 data-[side=left]:slide-in-from-right-2",
            className
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </DropdownMenuPortal>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean
}) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn(
        "px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1.5 h-px bg-zinc-100 dark:bg-white/10", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-zinc-400 dark:text-zinc-500",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
}
