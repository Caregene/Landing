"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react"

export type EventItem = {
  title: string
  host: string
  date: string
  time: string
  type: string
  attendees: number
  description: string
}

const defaultEvents: EventItem[] = [
  {
    title: "Genetic Testing Q&A Session",
    host: "Dr. Jennifer Chen",
    date: "Friday, Dec 15",
    time: "3:00 PM EST",
    type: "Virtual",
    attendees: 45,
    description: "Discussion about new pediatric genetic testing guidelines",
  },
  {
    title: "22q Family Meetup - Boston",
    host: "Boston 22q Support Group",
    date: "Saturday, Dec 16",
    time: "10:00 AM EST",
    type: "In-Person",
    attendees: 23,
    description: "Local meetup for families in the Boston area",
  },
  {
    title: "Turner Syndrome Awareness Webinar",
    host: "Turner Syndrome Society",
    date: "Monday, Dec 18",
    time: "7:00 PM EST",
    type: "Virtual",
    attendees: 78,
    description: "Educational session about Turner Syndrome research updates",
  },
]

export default function Events({ items = defaultEvents }: { items?: EventItem[] }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((event, index) => (
          <Card key={index}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.type}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {event.attendees} attending
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Hosted by {event.host}</p>
                </div>
                <div className="flex flex-col space-y-2 w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto">
                    Join Event
                  </Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent text-foreground/80 hover:bg-accent/50">
                    Remind Me
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
