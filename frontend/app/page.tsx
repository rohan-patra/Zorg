"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function HealthRecordsPage() {
  const { toast } = useToast()

  const handleSubmit = async (action: any) => {
    console.log(`${action} submitted`)
    toast({
      title: `${action} Successful`,
      description: `Your request for ${action} has been processed.`,
    })
  }

  return (
    <div className="p-4">
      <Toaster />
      <h1 className="mb-4 text-xl font-bold">Manage Your Health Records</h1>

      <Tabs defaultValue="view" className="w-full">
        <TabsList>
          <TabsTrigger value="view">View Records</TabsTrigger>
          <TabsTrigger value="delegate">Delegate Access</TabsTrigger>
          <TabsTrigger value="send">Send to Provider</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <p>
            Your health records fetched from the Caldera chain will be displayed
            here.
          </p>
          {/* Here you might want to add a component or function call to actually fetch and display the records */}
        </TabsContent>
        <TabsContent value="delegate">
          <Button onClick={() => handleSubmit("Delegating access")}>
            Delegate Access
          </Button>
          {/* Additional form or UI elements for delegation process can go here */}
        </TabsContent>
        <TabsContent value="send">
          <Button onClick={() => handleSubmit("Sending records")}>
            Send Records
          </Button>
          {/* Additional form or UI elements for sending records can go here */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
