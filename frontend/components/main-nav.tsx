"use client"

import { MainNav as NavigationMainNav } from "./navigation"
import { Search } from "./search"
import { ThemeToggle } from "./theme-toggle"
import { UserNav } from "./user-nav"

export function MainNav() {
  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <NavigationMainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
