"use client";

import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { insertReviewSchema } from "@/lib/validators";
import { createUpdateReview, getReviewByProductId } from "@/lib/actions/review.actions";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { reviewDefaultValues } from "@/lib/constants";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarIcon } from "lucide-react";


const ReviewForm = ({
    userId,
    productId,
    onReviewSubmitted,
}: {
    userId: string;
    productId: string;
    onReviewSubmitted: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof insertReviewSchema>>({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: reviewDefaultValues,
    });

    // Open Form Handler
    const handleFormOpen = async () => {
        form.setValue('productId', productId);
        form.setValue('userId', userId);

        const review = await getReviewByProductId({ productId });
        if (review) {
            form.setValue('title', review?.data?.title || "");
            form.setValue('description', review?.data?.description || "");
            form.setValue('rating', review?.data?.rating || 0);
        }
        setOpen(true);
    };

    // Form Submit Handler
    const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
        const result = await createUpdateReview({
            ...values,
            productId,
        });
        if (!result.success) {
            toast.error(result.message || "Failed to submit review");
        }
        form.reset();
        setOpen(false);
        onReviewSubmitted();
        toast.success(result.message);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleFormOpen} variant={"default"}>
                    Write a Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <Form {...form}>
                    <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>
                                Share your thoughts about the product
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Review title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Review description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={
                                                field.value.toString()
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <SelectItem
                                                        key={rating}
                                                        value={rating.toString()}>
                                                        {rating}{" "}<StarIcon className="h-4 w-4 inline" />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                size={"lg"}
                                className={cn("w-full")}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewForm;
