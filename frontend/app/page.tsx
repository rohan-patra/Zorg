"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function HealthRecordsPage() {
  const { toast } = useToast()

  const handleSubmit = () => {
    toast({
      title: "Access Granted",
      description: "You have successfully granted access to your records.",
    })
  }

  const patients = [
    {
      id: "PAT001",
      name: "John Doe",
      age: 32,
      gender: "Male",
      condition: "Condition A",
    },
    {
      id: "PAT002",
      name: "Jane Smith",
      age: 28,
      gender: "Female",
      condition: "Condition B",
    },
    {
      id: "PAT003",
      name: "Alice Johnson",
      age: 45,
      gender: "Female",
      condition: "Condition C",
    },
    {
      id: "PAT004",
      name: "Bob Brown",
      age: 52,
      gender: "Male",
      condition: "Condition D",
    },
    {
      id: "PAT005",
      name: "Charlie Green",
      age: 37,
      gender: "Male",
      condition: "Condition E",
    },
    {
      id: "PAT006",
      name: "Diana Hayes",
      age: 29,
      gender: "Female",
      condition: "Condition F",
    },
    {
      id: "PAT007",
      name: "Evan Turner",
      age: 41,
      gender: "Male",
      condition: "Condition G",
    },
    {
      id: "PAT008",
      name: "Fiona Gallagher",
      age: 34,
      gender: "Female",
      condition: "Condition H",
    },
    {
      id: "PAT009",
      name: "George King",
      age: 48,
      gender: "Male",
      condition: "Condition I",
    },
    {
      id: "PAT010",
      name: "Hannah Abbott",
      age: 26,
      gender: "Female",
      condition: "Condition J",
    },
    {
      id: "PAT011",
      name: "Ian Vance",
      age: 50,
      gender: "Male",
      condition: "Condition K",
    },
    {
      id: "PAT012",
      name: "Julia Mills",
      age: 30,
      gender: "Female",
      condition: "Condition L",
    },
    {
      id: "PAT013",
      name: "Kyle Nero",
      age: 39,
      gender: "Male",
      condition: "Condition M",
    },
    {
      id: "PAT014",
      name: "Luna Gold",
      age: 42,
      gender: "Female",
      condition: "Condition N",
    },
    {
      id: "PAT015",
      name: "Mason Ford",
      age: 29,
      gender: "Male",
      condition: "Condition O",
    },
    {
      id: "PAT016",
      name: "Nora Queen",
      age: 35,
      gender: "Female",
      condition: "Condition P",
    },
    {
      id: "PAT017",
      name: "Oliver Potts",
      age: 47,
      gender: "Male",
      condition: "Condition Q",
    },
    {
      id: "PAT018",
      name: "Piper Halliwell",
      age: 31,
      gender: "Female",
      condition: "Condition R",
    },
  ]

  const healthRecords = {
    demographics: { age: 29, weight: "180 lbs", height: "6 ft" },
    insurance: { provider: "HealthCare Inc.", policyNumber: "HC123456789" },
    imagingStudies: [{ date: "2021-01-01", description: "Chest X-Ray" }],
    labResults: [{ date: "2021-01-10", result: "CBC Normal" }],
    medicalHistory: ["Diabetes", "Hypertension"],
    patientFeedback: ["Satisfied with service", "Quick response times"],
  }

  const labResults = [
    {
      test: "Complete Blood Count (CBC)",
      date: "2023-03-01",
      result: "Normal",
    },
    {
      test: "Lipid Panel",
      date: "2023-03-15",
      result: "High cholesterol",
    },
    {
      test: "Thyroid-Stimulating Hormone (TSH)",
      date: "2023-04-10",
      result: "Normal",
    },
    {
      test: "Hemoglobin A1C",
      date: "2023-05-05",
      result: "Pre-diabetic",
    },
    // ...more lab results
  ]

  const medicalHistory = [
    "Hypertension diagnosed in 2018",
    "Type 2 diabetes diagnosed in 2019",
    "Underwent appendectomy in 2020",
    "Seasonal allergies",
    // ...more medical history entries
  ]

  // Dummy patient feedback data
  const patientFeedback = [
    "Very satisfied with the care received during hospital stay in March.",
    "The new patient portal is user-friendly and helpful.",
    "Would appreciate more follow-up on test results.",
    "Physical therapy sessions were extremely beneficial.",
    // ...more feedback entries
  ]

  const imagingStudies = [
    {
      type: "Chest X-Ray",
      date: "2023-02-14",
      findings: "No acute disease.",
    },
    {
      type: "Abdominal Ultrasound",
      date: "2023-02-20",
      findings: "Gallstones present.",
    },
    {
      type: "CT Head",
      date: "2023-03-05",
      findings: "Chronic sinusitis.",
    },
    {
      type: "MRI Lumbar Spine",
      date: "2023-03-18",
      findings: "Evidence of herniated disc.",
    },
    {
      type: "CT Abdomen/Pelvis",
      date: "2023-04-10",
      findings: "Normal study.",
    },
    // ...more imaging studies
  ]

  return (
    <div className="p-4">
      <Toaster />
      <h1 className="mb-4 text-xl font-bold">Manage Your Health Records</h1>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          John Doe
        </h1>
        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-teal-400 text-white transition-colors hover:from-blue-600 hover:to-teal-500 dark:from-blue-600 dark:to-teal-500 dark:hover:from-blue-700 dark:hover:to-teal-600">
                Grant Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Grant Access</DialogTitle>
                <DialogDescription>
                  Grant access to records to new provider.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Wallet Address
                  </Label>
                  <Input id="address" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="ml-4">
            Manage Access
          </Button>
        </div>
      </div>
      <br />
      <Tabs defaultValue="demographics">
        <TabsList>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="imagingStudies">Imaging Studies</TabsTrigger>
          <TabsTrigger value="labResults">Lab Results</TabsTrigger>
          <TabsTrigger value="medicalHistory">Medical History</TabsTrigger>
          <TabsTrigger value="patientFeedback">Patient Feedback</TabsTrigger>
        </TabsList>
        <TabsContent
          value="demographics"
          className="rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white">
              <Label className="shrink-0">Age:</Label>
              <span className="ml-2 rounded-full bg-blue-500 px-3 py-1 text-white dark:bg-blue-600">
                {healthRecords.demographics.age}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white">
              <Label className="shrink-0">Weight:</Label>
              <span className="ml-2 rounded-full bg-blue-500 px-3 py-1 text-white dark:bg-blue-600">
                {healthRecords.demographics.weight}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white">
              <Label className="shrink-0">Height:</Label>
              <span className="ml-2 rounded-full bg-blue-500 px-3 py-1 text-white dark:bg-blue-600">
                {healthRecords.demographics.height}
              </span>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="insurance"
          className="rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white">
              <Label className="shrink-0">Provider:</Label>
              <span className="ml-2 rounded-full bg-blue-500 px-3 py-1 text-white dark:bg-blue-600">
                {healthRecords.insurance.provider}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white">
              <Label className="shrink-0">Policy Number:</Label>
              <span className="ml-2 rounded-full bg-blue-500 px-3 py-1 text-white dark:bg-blue-600">
                {healthRecords.insurance.policyNumber}
              </span>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="labResults"
          className="rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800"
        >
          <div className="space-y-4">
            {labResults.map((lab, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white"
              >
                <Label className="shrink-0">{lab.test}:</Label>
                <div className="ml-2">
                  <span className="mr-2 rounded-full bg-green-500 px-3 py-1 text-white dark:bg-green-600">
                    {lab.date}
                  </span>
                  <span className="rounded-full bg-red-500 px-3 py-1 text-white dark:bg-red-600">
                    {lab.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent
          value="medicalHistory"
          className="rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800"
        >
          <ul className="list-disc space-y-2 pl-5 text-gray-900 dark:text-white">
            {medicalHistory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent
          value="patientFeedback"
          className="rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800"
        >
          <ul className="list-disc space-y-2 pl-5 text-gray-900 dark:text-white">
            {patientFeedback.map((feedback, index) => (
              <li key={index}>{feedback}</li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent
          value="imagingStudies"
          className="rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-800"
        >
          <div className="space-y-4">
            {imagingStudies.map((study, index) => (
              <div
                key={index}
                className="flex flex-col justify-between text-lg font-medium text-gray-900 dark:text-white md:flex-row"
              >
                <Label className="shrink-0">{study.type}:</Label>
                <div className="ml-2 md:ml-4">
                  <span className="mr-2 rounded-full bg-purple-500 px-3 py-1 text-white dark:bg-purple-600">
                    {study.date}
                  </span>
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-white dark:bg-yellow-600">
                    {study.findings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
