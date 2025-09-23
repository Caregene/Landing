'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageCircle, Star, Video } from 'lucide-react'

export default function ExpertConnect() {
  const experts = [
    {
      name: 'Dr. Jennifer Chen',
      title: 'Genetic Counselor',
      specialty: '22q11.2 Deletion Syndrome',
      rating: 4.9,
      reviews: 127,
      availability: 'Available Today',
      image: 'JC',
    },
    {
      name: 'Dr. Michael Rodriguez',
      title: 'Pediatric Cardiologist',
      specialty: 'Congenital Heart Defects',
      rating: 4.8,
      reviews: 89,
      availability: 'Next Available: Tomorrow',
      image: 'MR',
    },
    {
      name: 'Dr. Sarah Williams',
      title: 'Developmental Pediatrician',
      specialty: 'Autism Spectrum Disorders',
      rating: 4.9,
      reviews: 156,
      availability: 'Available Today',
      image: 'SW',
    },
  ] as const

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {experts.map((expert, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{expert.image}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{expert.name}</CardTitle>
                <CardDescription>{expert.title}</CardDescription>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{expert.rating}</span>
                  <span className="text-sm text-muted-foreground">({expert.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Specialty:</span>
                <p className="text-sm text-muted-foreground">{expert.specialty}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Availability:</span>
                <p className="text-sm text-muted-foreground">{expert.availability}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent text-foreground/80 hover:bg-accent/50">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
