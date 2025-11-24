import React from "react";
import Sidebar from "../components/Sidebar";
import { useCourses } from "../api/courses";
import { useLessons } from "../api/lessons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useCourses();
  const { data: lessons, isLoading: lessonsLoading, isError: lessonsError } = useLessons();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-28 px-8 md:px-12">
        <h1 className="text-3xl font-bold mb-12">Dashboard</h1>

        {/* Courses Section */}
        <Section title="Courses" loading={coursesLoading} error={coursesError}>
          <ItemGrid data={courses} loading={coursesLoading} />
        </Section>

        {/* Lessons Section */}
        <Section title="Lessons" loading={lessonsLoading} error={lessonsError}>
          <ItemGrid data={lessons} loading={lessonsLoading} />
        </Section>
      </main>
    </div>
  );
}

/* ----------------------------------------- */
/* Section Component                          */
/* ----------------------------------------- */
function Section({ title, loading, error, children }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <p className="text-destructive-foreground">Failed to load {title.toLowerCase()}.</p>
      ) : (
        children
      )}
    </section>
  );
}

/* ----------------------------------------- */
/* Grid Component                             */
/* ----------------------------------------- */
function ItemGrid({ data, loading }) {
  if (!data?.length && !loading) {
    return <p className="text-muted-foreground">No items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="p-4 rounded-lg animate-pulse">
              <Skeleton className="h-6 w-3/4 mb-2 rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </Card>
          ))
        : data.map((item) => (
            <Card
              key={item._id}
              className="transition-shadow hover:shadow-xl p-4 rounded-lg bg-card text-card-foreground"
            >
              <CardHeader>
                <CardTitle className="mb-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
