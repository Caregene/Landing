'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Activity, Lightbulb, Target, Star } from 'lucide-react'

export default function Insights() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold">Community Insights</h2>
          <p className="text-muted-foreground">Data-driven insights from our community</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Full Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Most Discussed Topics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { topic: 'Early Intervention', posts: 234, trend: '+12%' },
                { topic: 'School Advocacy', posts: 189, trend: '+8%' },
                { topic: 'Therapy Progress', posts: 156, trend: '+15%' },
                { topic: 'Medical Updates', posts: 134, trend: '+5%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.topic}</p>
                    <p className="text-sm text-muted-foreground">{item.posts} posts</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {item.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>Success Stories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium">Milestone Achievements</p>
                <p className="text-xs text-muted-foreground">
                  89% of families report progress in targeted areas within 6 months
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium">Community Support Impact</p>
                <p className="text-xs text-muted-foreground">
                  94% feel more confident after joining support groups
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium">Expert Consultations</p>
                <p className="text-xs text-muted-foreground">Average response time: 2.3 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Resource Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { resource: 'Early Intervention Guide', downloads: 1234, rating: 4.8 },
                { resource: 'Insurance Toolkit', downloads: 892, rating: 4.6 },
                { resource: 'School Advocacy', downloads: 756, rating: 4.9 },
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{item.resource}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{item.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{item.downloads} downloads</p>
                    <div className="w-16 h-1 bg-muted rounded-full">
                      <div
                        className="h-1 bg-primary rounded-full"
                        style={{ width: `${(item.downloads / 1500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trending Discussions</CardTitle>
          <CardDescription>Hot topics in the community right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                title: 'New Gene Therapy Breakthrough',
                author: 'Dr. Sarah Williams',
                replies: 45,
                views: 1200,
                trend: '🔥 Hot',
              },
              {
                title: 'Insurance Coverage Updates 2024',
                author: 'Community Team',
                replies: 67,
                views: 890,
                trend: '📈 Rising',
              },
              {
                title: 'School IEP Success Stories',
                author: 'Jennifer M.',
                replies: 23,
                views: 456,
                trend: '💬 Active',
              },
              {
                title: 'Telehealth vs In-Person Care',
                author: 'Dr. Michael Rodriguez',
                replies: 34,
                views: 678,
                trend: '🤔 Debated',
              },
            ].map((discussion, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{discussion.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {discussion.trend}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">by {discussion.author}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{discussion.replies} replies</span>
                  <span>{discussion.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
