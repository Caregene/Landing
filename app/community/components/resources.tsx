'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Resource = {
  title: string
  type: string
  downloads: number
  description: string
}

const DEFAULT_RESOURCES: ReadonlyArray<Resource> = [
  {
    title: 'Early Intervention Guide',
    type: 'PDF Guide',
    downloads: 1234,
    description: 'Comprehensive guide to early intervention services for children with developmental delays',
  },
  {
    title: 'Insurance Navigation Toolkit',
    type: 'Resource Kit',
    downloads: 892,
    description: 'Tools and templates for navigating insurance coverage for genetic conditions',
  },
  {
    title: 'School Advocacy Handbook',
    type: 'Handbook',
    downloads: 756,
    description: "Guide for advocating for your child's educational needs and accommodations",
  },
  {
    title: 'Genetic Testing Decision Tree',
    type: 'Interactive Tool',
    downloads: 543,
    description: 'Interactive tool to help families make informed decisions about genetic testing',
  },
  {
    title: 'Emergency Medical Information Template',
    type: 'Template',
    downloads: 678,
    description: 'Customizable template for emergency medical information cards',
  },
  {
    title: 'Therapy Progress Tracker',
    type: 'Spreadsheet',
    downloads: 432,
    description: "Track your child's progress across different therapy modalities",
  },
]

export default function Resources({ items = DEFAULT_RESOURCES }: { items?: ReadonlyArray<Resource> }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((resource, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{resource.title}</CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">{resource.type}</Badge>
              <span className="text-sm text-muted-foreground">{resource.downloads} downloads</span>
            </div>
            <Button className="w-full">Download Resource</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
