import React from "react";
import Sidebar from "../components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const items = [
    { title: "Manage Courses", link: "/courses" },
    { title: "Manage Lessons", link: "/lessons" },
    { title: "Manage Users", link: "/users" },
    { title: "Manage Payments", link: "/payments" },
    { title: "Manage Bookings", link: "/bookings" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 pt-28 px-8 md:px-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Admin Dashboard
        </h1>

        <p className="text-muted-foreground mb-12 leading-relaxed">
          Manage courses, lessons, users, payments, and bookings here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card
              key={item.title}
              className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between mb-2 text-lg font-semibold">
                  {item.title}
                  <ArrowRight className="w-5 h-5 opacity-60 group-hover:translate-x-1 transition-transform" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Click to manage {item.title.toLowerCase()}.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
