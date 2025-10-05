"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageSquare,
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Edit3,
  Eye,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Merged Reviews Table Component
 *
 * DB columns expected:
 *  - id (number)
 *  - Name (string)
 *  - Content (string)
 *  - Duration (string, e.g. "1h 30m" or "45m")
 *  - Category (string)
 *  - numLikes (number)
 *
 * UI model fields:
 *  - id, name, content, duration, category, spreadScore (from numLikes), resolved (boolean)
 */

type DbRow = {
  id: number;
  Name: string;
  Content: string | null;
  Duration: string | null;
  Category: string | null;
  numLikes: number | null;
};

type Review = {
  id: number;
  name: string;
  content: string;
  duration: string;
  category: string;
  spreadScore: number;
  resolved: boolean;
  email?: string;
};

export default function ReviewsTable() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Editing states
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  // Content modal
  const [selectedContent, setSelectedContent] = useState<{
    name: string;
    content: string;
    category: string;
  } | null>(null);

  // fetch and map DB rows
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Reviews").select("*");


      if (error) {
        console.error("Supabase fetch error:", error);
        setLoading(false);
        return;
      }
      const mapped: Review[] = (data || []).map((r) => ({
        id: r.id,
        name: r.Name ?? "Unknown",
        content: r.Content ?? "",
        duration: r.Duration ?? "0m",
        category: r.Category ?? "Uncategorized",
        spreadScore: typeof r.numLikes === "number" ? r.numLikes : 0,
        resolved: false, // default; if you store resolved in DB, map here
        email: "", // optional (DB didn't provide)
      }));
      setReviews(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Optionally: subscribe to realtime updates here
  }, []);

  // ---------- Helper UI functions ----------
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-primary";
    return "text-red-400";
  };

  const getScoreDot = (score: number) => {
    if (score >= 8) return "bg-green-400";
    if (score >= 6) return "bg-primary";
    return "bg-red-400";
  };

  const getStatusColor = (resolved: boolean) => {
    return resolved ? "text-green-400" : "text-red-400";
  };

  const getStatusDot = (resolved: boolean) => {
    return resolved ? "bg-green-400" : "bg-red-400";
  };

  // parse "1h 30m" or "90m" to minutes
  const parseDurationToMinutes = (duration: string): number => {
    let totalMinutes = 0;
    const hoursMatch = duration.match(/(\d+)\s*h/);
    if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
    const minutesMatch = duration.match(/(\d+)\s*m/);
    if (minutesMatch) totalMinutes += parseInt(minutesMatch[1], 10);
    return totalMinutes;
  };

  // Sorting + filtering
  const filteredAndSortedReviews = useMemo(() => {
    const filtered = reviews.filter((review) => {
      const q = searchTerm.toLowerCase();
      return (
        review.name.toLowerCase().includes(q) ||
        review.content.toLowerCase().includes(q) ||
        (review.email ?? "").toLowerCase().includes(q) ||
        review.category.toLowerCase().includes(q)
      );
    });

    const sorted = filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        case "duration":
          aValue = parseDurationToMinutes(a.duration);
          bValue = parseDurationToMinutes(b.duration);
          break;
        case "spreadScore":
          aValue = a.spreadScore;
          bValue = b.spreadScore;
          break;
        case "resolved":
          aValue = a.resolved ? 1 : 0;
          bValue = b.resolved ? 1 : 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue === bValue) return 0;
      if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return sorted;
  }, [reviews, searchTerm, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ---------- inline editing handlers ----------
  const startEdit = (reviewId: number, field: string, currentValue: string | number | boolean) => {
    setEditingCell({ id: reviewId, field });
    setEditingValue(currentValue === null || currentValue === undefined ? "" : String(currentValue));
  };

  // Save the edit locally + push to Supabase (update DB)
  const saveEdit = async () => {
    if (!editingCell) return;

    const { id, field } = editingCell;
    let value: any = editingValue;

    // convert expected field types
    if (field === "spreadScore") value = parseFloat(editingValue) || 0;
    if (field === "resolved") value = editingValue.toLowerCase() === "true" || editingValue.toLowerCase() === "resolved";

    // Update local state
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );

    // Map UI fields to DB columns for update
    const dbUpdate: Partial<Record<string, any>> = {};
    if (field === "name") dbUpdate["Name"] = value;
    else if (field === "content") dbUpdate["Content"] = value;
    else if (field === "duration") dbUpdate["Duration"] = value;
    else if (field === "category") dbUpdate["Category"] = value;
    else if (field === "spreadScore") dbUpdate["numLikes"] = value;
    else if (field === "resolved") dbUpdate["resolved"] = value; // only if your DB has this column

    // Push update to Supabase
    try {
      const { error } = await supabase.from("Reviews").update(dbUpdate).eq("id", id);
      if (error) console.error("Update error:", error);
    } catch (err) {
      console.error("Update exception:", err);
    } finally {
      setEditingCell(null);
      setEditingValue("");
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditingValue("");
  };

  const handleCellEdit = (review: Review, field: string, currentValue: any) => {
    startEdit(review.id, field, currentValue);
  };

  const renderEditableCell = (review: Review, field: string, value: string | number | boolean, className = "") => {
    const isEditing = editingCell?.id === review.id && editingCell?.field === field;
    const displayValue = field === "resolved" ? (value ? "RESOLVED" : "PENDING") : String(value);

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 w-full">
          <input
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            className="w-full bg-card/50 border border-primary/50 rounded px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            autoFocus
          />
          <button onClick={saveEdit} className="text-green-400 hover:text-green-300 p-1">
            <Check className="w-3 h-3" />
          </button>
          <button onClick={cancelEdit} className="text-red-400 hover:text-red-300 p-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      );
    }

    return (
      <div
        className={`group cursor-pointer hover:bg-card/20 rounded px-2 py-1 transition-colors flex items-center gap-2 ${className}`}
        onClick={() => startEdit(review.id, field, value)}
      >
        <span className="font-mono">{displayValue}</span>
        <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  // View full content in modal
  const openContentModal = (review: Review) => {
    setSelectedContent({
      name: review.name,
      content: review.content,
      category: review.category,
    });
  };

  return (
    <div className="bg-card/20 backdrop-blur-xl border border-card-border rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="p-6 border-b border-card-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-foreground font-mono">CUSTOMER REVIEWS</h2>
              <div className="px-2 py-1 bg-primary/10 rounded text-xs font-mono text-primary">
                {reviews.length}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent ml-4" />
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-64 bg-card/30 border border-border/50 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                />
              </div>

              {/* Add Button (example) */}
              <button
                onClick={() =>
                  setReviews((prev) => [
                    {
                      id: Date.now(),
                      name: "New",
                      content: "",
                      duration: "0m",
                      category: "Uncategorized",
                      spreadScore: 0,
                      resolved: false,
                    },
                    ...prev,
                  ])
                }
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-mono transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                ADD REVIEW
              </button>
            </div>
          </div>
        </div>

        {/* Table Container with Fixed Header */}
        <div className="relative max-h-[65vh] overflow-hidden border border-card-border/50 rounded-lg">
          {/* Fixed Table Header */}
          <div className="sticky top-0 z-20 bg-card/60 backdrop-blur-md border-b-2 border-primary/50 shadow-lg">
            <div className="grid grid-cols-6 px-6 py-4 text-xs font-mono text-primary uppercase tracking-wider">
              <button
                onClick={() => handleSort("name")}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4"
              >
                CUSTOMER
                {sortField === "name" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>

              <button
                onClick={() => handleSort("category")}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
              >
                CATEGORY
                {sortField === "category" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>

              <button
                onClick={() => handleSort("duration")}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
              >
                DURATION
                {sortField === "duration" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>

              <button
                onClick={() => handleSort("spreadScore")}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors border-r border-card-border/50 pr-4 pl-4"
              >
                SCORE
                {sortField === "spreadScore" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>

              <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">CONTENT</div>

              <button
                onClick={() => handleSort("resolved")}
                className="flex items-center gap-2 text-left hover:text-foreground transition-colors pl-4"
              >
                STATUS
                {sortField === "resolved" && (sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
              </button>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <div className="overflow-y-auto max-h-[calc(65vh-60px)]">
            <AnimatePresence>
              {filteredAndSortedReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: index * 0.01 }}
                  className={`grid grid-cols-6 px-6 py-4 text-sm border-b border-card-border/30 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-card/5 hover:bg-card/15" : "bg-card/10 hover:bg-card/20"
                  }`}
                >
                  {/* Customer */}
                  <div className="flex items-center gap-3 border-r border-card-border/50 pr-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary flex-shrink-0">
                      {review.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      {renderEditableCell(review, "name", review.name, "text-foreground")}
                      <div className="text-xs font-mono text-muted-foreground">#{String(review.id).padStart(3, "0")}</div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">
                    {renderEditableCell(review, "category", review.category, "text-foreground")}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center border-r border-card-border/50 pr-4 pl-4">
                    {renderEditableCell(review, "duration", review.duration, "text-foreground")}
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 border-r border-card-border/50 pr-4 pl-4">
                    <div className={`w-2 h-2 rounded-full ${getScoreDot(review.spreadScore)} flex-shrink-0`} />
                    {renderEditableCell(review, "spreadScore", review.spreadScore, `${getScoreColor(review.spreadScore)} text-xs`)}
                  </div>

                  {/* Content */}
                  <div className="border-r border-card-border/50 pr-4 pl-4">
                    <div className="max-w-xs">
                      <div className="text-sm text-foreground leading-relaxed break-words">
                        {editingCell?.id === review.id && editingCell?.field === "content" ? (
                          <textarea
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                saveEdit();
                              } else if (e.key === "Escape") {
                                cancelEdit();
                              }
                            }}
                            className="w-full min-h-[60px] p-2 bg-input/50 backdrop-blur-sm border border-primary/30 rounded-lg text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                            autoFocus
                            placeholder="Enter review content..."
                          />
                        ) : (
                          <div className="group relative">
                            <div className="p-2 rounded-lg min-h-[60px] flex items-start">
                              <span className="text-foreground leading-relaxed line-clamp-3">
                                {review.content || "No content available..."}
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openContentModal(review)}
                                className="h-6 w-6 p-0 hover:bg-primary/20"
                                title="View full content"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCellEdit(review, "content", review.content)}
                                className="h-6 w-6 p-0 hover:bg-primary/20"
                                title="Edit content"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 pl-4">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(review.resolved)} flex-shrink-0`} />
                    {renderEditableCell(review, "resolved", review.resolved, `${getStatusColor(review.resolved)} text-xs uppercase`)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredAndSortedReviews.length === 0 && !loading && (
              <div className="px-6 py-8 text-center text-muted-foreground">No reviews found.</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-card-border/50 bg-card/10">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="text-muted-foreground">
              SHOWING {filteredAndSortedReviews.length} OF {reviews.length} REVIEWS
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-muted-foreground">RESOLVED {reviews.filter((r) => r.resolved).length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-muted-foreground">PENDING {reviews.filter((r) => !r.resolved).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Modal */}
      <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
        <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border border-card-border">
          <DialogHeader>
            <DialogTitle className="text-foreground font-mono flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              FULL REVIEW CONTENT
              <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
            </DialogTitle>
          </DialogHeader>

          {selectedContent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-card/20 rounded-xl border border-border/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono text-primary">
                  {selectedContent.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-foreground font-mono">{selectedContent.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{selectedContent.category}</div>
                </div>
              </div>

              <div className="p-4 bg-card/10 rounded-xl border border-border/20">
                <div className="text-sm text-muted-foreground font-mono mb-2">REVIEW CONTENT:</div>
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedContent.content || "No content available..."}</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedContent(null)} className="font-mono">
                  CLOSE
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
