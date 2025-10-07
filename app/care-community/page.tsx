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
      <div className="min-h-screen bg-background pb-20 sm:pb-0">
        <div className="bg-card border-b border-border px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">Care Community</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Connect with families facing similar genetic health journeys
              </p>
            </div>
          </div>
        </div>

        <main className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="community" className="space-y-4 sm:space-y-6">
              <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 z-50 sm:static sm:border-t-0 sm:p-0 sm:bg-transparent">
                <div className="w-full overflow-x-auto">
                  <TabsList className="inline-flex h-10 sm:h-12 items-center justify-start rounded-lg bg-gray-100/50 p-1 text-muted-foreground min-w-max w-full sm:w-auto">
                    <TabsTrigger
                      value="community"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 min-w-[90px] touch-manipulation"
                    >
                      Community
                    </TabsTrigger>
                    <TabsTrigger
                      value="groups"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 min-w-[100px] touch-manipulation"
                    >
                      Groups
                    </TabsTrigger>
                    <TabsTrigger
                      value="experts"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 min-w-[90px] touch-manipulation"
                    >
                      Experts
                    </TabsTrigger>
                    <TabsTrigger
                      value="events"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 min-w-[80px] touch-manipulation"
                    >
                      Events
                    </TabsTrigger>
                    <TabsTrigger
                      value="resources"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 min-w-[100px] touch-manipulation"
                    >
                      Resources
                    </TabsTrigger>
                    <TabsTrigger
                      value="wellness"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 min-w-[90px] touch-manipulation"
                    >
                      Wellness
                    </TabsTrigger>
                    <TabsTrigger
                      value="insights"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 sm:px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-gray-50/80 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900 min-w-[90px] touch-manipulation"
                    >
                      Insights
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              {/* Community Feed */}
              <TabsContent value="community" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-lg sm:text-2xl font-bold">2,847</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Active Members</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-lg sm:text-2xl font-bold">156</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Posts Today</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-lg sm:text-2xl font-bold">89%</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Response Rate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-lg sm:text-2xl font-bold">4.9</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Community Rating</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <Avatar className="shrink-0 w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarFallback>YU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 w-full">
                        <Textarea
                          placeholder="Share your experience, ask a question, or offer support..."
                          className="min-h-[80px] resize-none text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge variant="outline" className="text-xs">
                          Anonymous
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Condition-Specific
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Urgent
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Success Story
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto bg-transparent touch-manipulation"
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save Draft
                        </Button>
                        <Button className="w-full sm:w-auto touch-manipulation">
                          <Send className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Community Posts */}
                <div className="space-y-3 sm:space-y-4">
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
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <Avatar className="shrink-0 w-8 h-8 sm:w-10 sm:h-10">
                            <AvatarFallback className="text-xs sm:text-sm">{post.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                              <span className="font-semibold text-sm sm:text-base">{post.author}</span>
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
                              <span className="text-xs sm:text-sm text-muted-foreground">{post.time}</span>
                            </div>
                            <p className="text-sm sm:text-base mb-3 sm:mb-4">{post.content}</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-4">
                              <Button variant="ghost" size="sm" className="touch-manipulation">
                                <Heart className="h-4 w-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="touch-manipulation">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {post.comments}
                              </Button>
                              <Button variant="ghost" size="sm" className="touch-manipulation">
                                <Bookmark className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button variant="ghost" size="sm" className="touch-manipulation">
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
              <TabsContent value="groups" className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search groups..." className="pl-10 w-full sm:w-80" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent touch-manipulation">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <Button className="w-full sm:w-auto touch-manipulation">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base sm:text-lg">{group.name}</CardTitle>
                          {group.isPrivate && <Shield className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <CardDescription className="text-sm">{group.description}</CardDescription>
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
                        <Button className="w-full touch-manipulation">Join Group</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Expert Connect */}
              <TabsContent value="experts" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                            <AvatarFallback className="text-sm sm:text-lg">{expert.image}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg">{expert.name}</CardTitle>
                            <CardDescription className="text-sm">{expert.title}</CardDescription>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs sm:text-sm font-medium">{expert.rating}</span>
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                ({expert.reviews} reviews)
                              </span>
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
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Button size="sm" className="flex-1 touch-manipulation">
                              <Video className="h-4 w-4 mr-2" />
                              Video Call
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent touch-manipulation">
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
              <TabsContent value="events" className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold">Upcoming Events</h2>
                  <Button className="w-full sm:w-auto touch-manipulation">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>

                <div className="space-y-3 sm:space-y-4">
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
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base sm:text-lg mb-2">{event.title}</h3>
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
                            <Button size="sm" className="w-full sm:w-auto touch-manipulation">
                              Join Event
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto bg-transparent touch-manipulation"
                            >
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
              <TabsContent value="resources" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">{resource.title}</CardTitle>
                        <CardDescription className="text-sm">{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{resource.downloads} downloads</span>
                        </div>
                        <Button className="w-full touch-manipulation">Download Resource</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Wellness */}
              <TabsContent value="wellness" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      title: "Mindfulness Meditation Guide",
                      type: "PDF Guide",
                      downloads: 987,
                      description: "A guide to mindfulness meditation for stress relief",
                    },
                    {
                      title: "Healthy Eating Plan",
                      type: "Resource Kit",
                      downloads: 654,
                      description: "A balanced eating plan for overall health",
                    },
                    {
                      title: "Exercise Routine",
                      type: "Handbook",
                      downloads: 321,
                      description: "A weekly exercise routine for physical well-being",
                    },
                  ].map((wellness, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">{wellness.title}</CardTitle>
                        <CardDescription className="text-sm">{wellness.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="text-xs">
                            {wellness.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{wellness.downloads} downloads</span>
                        </div>
                        <Button className="w-full touch-manipulation">Download Wellness Resource</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Insights */}
              <TabsContent value="insights" className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">Community Insights</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Data-driven insights from our community
                    </p>
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent touch-manipulation">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Full Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
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
                              <p className="font-medium text-sm">{item.topic}</p>
                              <p className="text-xs text-muted-foreground">{item.posts} posts</p>
                            </div>
                            <Badge variant="outline" className="text-green-600 text-xs">
                              {item.trend}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
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
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                        <Target className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
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
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Trending Discussions</CardTitle>
                    <CardDescription className="text-sm">Hot topics in the community right now</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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
                        <div
                          key={index}
                          className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 cursor-pointer touch-manipulation"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm sm:text-base">{discussion.title}</h4>
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
