"use client";
import { genreArray} from "@/lib/genres";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { editMovie } from "../_actions/movie-actions";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  movie: {
    id: string;
    title: string;
    description: string;
    price: number;
    releaseDate: Date;
    imageUrl: string;
    stock: number;
    runtime: number;
    // genres: FormValues["genres"];
    genres: string[];
  };
};
const formSchema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(500),
  price: z.coerce
    .number<number>()
    .int("Price must be an integer")
    .positive("Must be positive"),
  releaseDate: z.iso.date(),
  imageUrl: z.string(),
  stock: z.coerce
    .number<number>()
    .int("Stock must be an integer")
    .positive("Must be positive"),
  runtime: z.coerce
    .number<number>()
    .int("Runtime must be an integer")
    .positive("Must be positive"),
  genres: z.array(z.string()),
});

// type FormValues = z.infer<typeof formSchema>;

export default function EditMovieForm({ movie }: Props) {
  const anchor = useComboboxAnchor();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: movie.title,
      description: movie.description,
      price: movie.price,
      releaseDate: movie.releaseDate.toISOString().split("T")[0],
      imageUrl: movie.imageUrl,
      stock: movie.stock,
      runtime: movie.runtime,
      genres: movie.genres,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await editMovie(movie.id, value);

      router.push(`/movies/${movie.id}`);
    },
  });
  return (
    <Card className="max-w-3xl mx-auto bg-secondary shadow">
      <CardHeader>
        <CardDescription>Add movie</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            form.handleSubmit(ev);
          }}
        >
          <FieldGroup>
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="price">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(ev) =>
                        field.handleChange(Number(ev.target.value))
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="releaseDate">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Release Date</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={String(field.state.value)}
                      onBlur={field.handleBlur}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="imageUrl">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="stock">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(ev) =>
                        field.handleChange(Number(ev.target.value))
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="runtime">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Runtime in minutes
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(ev) =>
                        field.handleChange(Number(ev.target.value))
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="genres">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Genre</FieldLabel>
                    <Combobox
                      multiple
                      autoHighlight
                      items={genreArray}
                      defaultValue={movie.genres}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <ComboboxChips ref={anchor} className="w-full max-w-xs">
                        <ComboboxValue>
                          {(values) => (
                            <React.Fragment>
                              {values.map((value: string) => (
                                <ComboboxChip key={value}>{value}</ComboboxChip>
                              ))}
                              <ComboboxChipsInput />
                            </React.Fragment>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>No genres selected.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Button
                type="reset"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
