import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageWrapper } from "@/components/page-wrapper"
import {
  Users,
  MessageCircle,
  Shield,
  UserCheck,
  Search,
  Plus,
  Heart,
  MessageSquare,
  Calendar,
  MapPin,
  Clock,
  Star,
  Filter,
  Video,
  Send,
  AlertTriangle,
  Bookmark,
  TrendingUp,
  Award,
  Lightbulb,
  Target,
  Activity,
} from "lucide-react"

export default function CareCommunityPage() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        <div className="bg-card border-b border-border px-4 sm:px-6 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">Care Community</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Connect with families facing similar genetic health journeys
              </p>
            </div>
          </div>
        </div>

        <main className="px-4 py-6 max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="community" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
                <TabsTrigger value="community" className="text-xs sm:text-sm">
                  Community
                </TabsTrigger>
                <TabsTrigger value="groups" className="text-xs sm:text-sm">
                  Support Groups
                </TabsTrigger>
                <TabsTrigger value="experts" className="text-xs sm:text-sm">
                  Expert Connect
                </TabsTrigger>
                <TabsTrigger value="events" className="text-xs sm:text-sm">
                  Events
                </TabsTrigger>
                <TabsTrigger value="resources" className="text-xs sm:text-sm">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-xs sm:text-sm">
                  Insights
                </TabsTrigger>
              </TabsList>

              {/* Community Feed */}
              <TabsContent value="community" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-2xl font-bold">2,847</p>
                          <p className="text-sm text-muted-foreground">Active Members</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">156</p>
                          <p className="text-sm text-muted-foreground">Posts Today</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">89%</p>
                          <p className="text-sm text-muted-foreground">Response Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-2xl font-bold">4.9</p>
                          <p className="text-sm text-muted-foreground">Community Rating</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <Avatar className="shrink-0">
                        <AvatarFallback>YU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 w-full">
                        <Textarea
                          placeholder="Share your experience, ask a question, or offer support..."
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between mt-4 space-y-4 sm:space-y-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Anonymous</Badge>
                        <Badge variant="outline">Condition-Specific</Badge>
                        <Badge variant="outline">Urgent</Badge>
                        <Badge variant="outline">Success Story</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save Draft
                        </Button>
                        <Button className="w-full sm:w-auto">
                          <Send className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Community Posts */}
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      author: "Sarah M.",
                      avatar: "SM",
                      condition: "22q11.2 Deletion",
                      time: "2 hours ago",
                      content:
                        "Just wanted to share that our 5-year-old hit a major milestone today - first full sentence! For families dealing with speech delays, don't give up hope. Early intervention really works.",
                      likes: 24,
                      comments: 8,
                      isExpert: false,
                      isUrgent: false,
                      tags: ["milestone", "speech-therapy"],
                    },
                    {
                      id: 2,
                      author: "Dr. Jennifer Chen",
                      avatar: "JC",
                      condition: "Genetic Counselor",
                      time: "4 hours ago",
                      content:
                        "Reminder: The new genetic testing guidelines for pediatric patients are now available. I'll be hosting a Q&A session this Friday at 3 PM EST to discuss what this means for families.",
                      likes: 45,
                      comments: 12,
                      isExpert: true,
                      isUrgent: false,
                      tags: ["genetic-testing", "guidelines"],
                    },
                    {
                      id: 3,
                      author: "Mike & Lisa",
                      avatar: "ML",
                      condition: "Turner Syndrome",
                      time: "6 hours ago",
                      content:
                        "Looking for recommendations for growth hormone therapy experiences. Our daughter is 8 and we're considering starting treatment. Would love to hear from other families who've been through this.",
                      likes: 18,
                      comments: 15,
                      isExpert: false,
                      isUrgent: true,
                      tags: ["growth-hormone", "treatment"],
                    },
                  ].map((post) => (
                    <Card key={post.id} className={post.isUrgent ? "border-orange-200 bg-orange-50/50" : ""}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <Avatar className="shrink-0">
                            <AvatarFallback>{post.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold">{post.author}</span>
                              {post.isExpert && (
                                <Badge variant="secondary" className="text-xs">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Expert
                                </Badge>
                              )}
                              {post.isUrgent && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {post.condition}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{post.time}</span>
                            </div>
                            <p className="text-sm mb-4">{post.content}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-4">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {post.comments}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button variant="ghost" size="sm">
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Support Groups */}
              <TabsContent value="groups" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search groups..." className="pl-10 w-full sm:w-80" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    {
                      name: "22q11.2 Deletion Support",
                      members: 234,
                      description: "Support for families affected by 22q11.2 deletion syndrome",
                      activity: "Very Active",
                      isPrivate: false,
                    },
                    {
                      name: "Turner Syndrome Warriors",
                      members: 189,
                      description: "Empowering girls and women with Turner Syndrome",
                      activity: "Active",
                      isPrivate: false,
                    },
                    {
                      name: "Rare Disease Parents",
                      members: 456,
                      description: "General support for parents of children with rare genetic conditions",
                      activity: "Very Active",
                      isPrivate: false,
                    },
                    {
                      name: "NICU Graduates",
                      members: 312,
                      description: "Support for families with children who spent time in NICU",
                      activity: "Moderate",
                      isPrivate: true,
                    },
                  ].map((group, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          {group.isPrivate && <Shield className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <CardDescription>{group.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{group.members} members</span>
                            <Badge
                              variant={group.activity === "Very Active" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {group.activity}
                            </Badge>
                          </div>
                        </div>
                        <Button className="w-full">Join Group</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Expert Connect */}
              <TabsContent value="experts" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Dr. Jennifer Chen",
                      title: "Genetic Counselor",
                      specialty: "22q11.2 Deletion Syndrome",
                      rating: 4.9,
                      reviews: 127,
                      availability: "Available Today",
                      image: "JC",
                    },
                    {
                      name: "Dr. Michael Rodriguez",
                      title: "Pediatric Cardiologist",
                      specialty: "Congenital Heart Defects",
                      rating: 4.8,
                      reviews: 89,
                      availability: "Next Available: Tomorrow",
                      image: "MR",
                    },
                    {
                      name: "Dr. Sarah Williams",
                      title: "Developmental Pediatrician",
                      specialty: "Autism Spectrum Disorders",
                      rating: 4.9,
                      reviews: 156,
                      availability: "Available Today",
                      image: "SW",
                    },
                  ].map((expert, index) => (
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
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Events */}
              <TabsContent value="events" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h2 className="text-xl font-semibold">Upcoming Events</h2>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>

                <div className="space-y-4">
                  {[
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
                  ].map((event, index) => (
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
                            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                              Remind Me
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resources */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Early Intervention Guide",
                      type: "PDF Guide",
                      downloads: 1234,
                      description:
                        "Comprehensive guide to early intervention services for children with developmental delays",
                    },
                    {
                      title: "Insurance Navigation Toolkit",
                      type: "Resource Kit",
                      downloads: 892,
                      description: "Tools and templates for navigating insurance coverage for genetic conditions",
                    },
                    {
                      title: "School Advocacy Handbook",
                      type: "Handbook",
                      downloads: 756,
                      description: "Guide for advocating for your child's educational needs and accommodations",
                    },
                    {
                      title: "Genetic Testing Decision Tree",
                      type: "Interactive Tool",
                      downloads: 543,
                      description: "Interactive tool to help families make informed decisions about genetic testing",
                    },
                    {
                      title: "Emergency Medical Information Template",
                      type: "Template",
                      downloads: 678,
                      description: "Customizable template for emergency medical information cards",
                    },
                    {
                      title: "Therapy Progress Tracker",
                      type: "Spreadsheet",
                      downloads: 432,
                      description: "Track your child's progress across different therapy modalities",
                    },
                  ].map((resource, index) => (
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
              </TabsContent>

              {/* Insights */}
              <TabsContent value="insights" className="space-y-6">
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
                        <Activity className="h-5 w-5 text-blue-500" />
                        <span>Most Discussed Topics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { topic: "Early Intervention", posts: 234, trend: "+12%" },
                          { topic: "School Advocacy", posts: 189, trend: "+8%" },
                          { topic: "Therapy Progress", posts: 156, trend: "+15%" },
                          { topic: "Medical Updates", posts: 134, trend: "+5%" },
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
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
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
                        <Target className="h-5 w-5 text-red-500" />
                        <span>Resource Usage</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { resource: "Early Intervention Guide", downloads: 1234, rating: 4.8 },
                          { resource: "Insurance Toolkit", downloads: 892, rating: 4.6 },
                          { resource: "School Advocacy", downloads: 756, rating: 4.9 },
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
                          title: "New Gene Therapy Breakthrough",
                          author: "Dr. Sarah Williams",
                          replies: 45,
                          views: 1200,
                          trend: "🔥 Hot",
                        },
                        {
                          title: "Insurance Coverage Updates 2024",
                          author: "Community Team",
                          replies: 67,
                          views: 890,
                          trend: "📈 Rising",
                        },
                        {
                          title: "School IEP Success Stories",
                          author: "Jennifer M.",
                          replies: 23,
                          views: 456,
                          trend: "💬 Active",
                        },
                        {
                          title: "Telehealth vs In-Person Care",
                          author: "Dr. Michael Rodriguez",
                          replies: 34,
                          views: 678,
                          trend: "🤔 Debated",
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
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </PageWrapper>
  )
}
