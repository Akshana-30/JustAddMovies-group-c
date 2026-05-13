"use client";
import { genreArray } from "@/lib/genres";
import {
  Card,
  CardContent,
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
import { fromOre, toOre } from "@/lib/format";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DeleteMovieButton, {
  RestoreMovieButton,
} from "@/components/admin-buttons/delete-button";
import { toast } from "sonner";
import Link from "next/link";

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
    genres: string[];
    directors: string[];
    actors: string[];
    deletedAt: Date | null;
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
  directors: z.array(z.string()),
  actors: z.array(z.string()),
});

export default function EditMovieForm({ movie }: Props) {
  const [isDeleted, setIsDeleted] = useState(movie.deletedAt !== null);
  const [directorInput, setDirectorInput] = useState("");
  const [actorInput, setActorInput] = useState("");
  const anchor = useComboboxAnchor();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: movie.title,
      description: movie.description,
      price: fromOre(movie.price),
      releaseDate: movie.releaseDate.toISOString().split("T")[0],
      imageUrl: movie.imageUrl,
      stock: movie.stock,
      runtime: movie.runtime,
      genres: movie.genres,
      directors: movie.directors,
      actors: movie.actors,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await editMovie(movie.id, { ...value, price: toOre(value.price) });
      toast.success("Movie was successfully updated.", {
        position: "bottom-right",
      });
      router.push(`/admin-dashboard/admin/movies`);
    },
  });
  return (
    <Card className="max-w-3xl mt-10 mx-auto border">
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
            <div className="flex gap-4">
              <form.Field name="price">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex 1">
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
              <form.Field name="stock">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="flex 1">
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
                    <Field data-invalid={isInvalid} className="flex 1">
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
            </div>
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
                      <ComboboxChips ref={anchor} className="w-full max-w-full">
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

            <form.Field name="directors" mode="array">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                const handleAdd = () => {
                  const names = directorInput
                    .split(",")
                    .map((n) => n.trim())
                    .filter(Boolean);
                  names.forEach((name) => field.pushValue(name));
                  setDirectorInput("");
                };

                return (
                  <Field data-invalid={isInvalid} className="border p-2">
                    <FieldLabel>Directors</FieldLabel>

                    <div className="py-2">
                      {field.state.value.map((name, index) => (
                        <span
                          className=" px-2 py-1 rounded mr-1 mt-1 text-xs text-foreground bg-muted"
                          key={index}
                        >
                          {`${name} `}
                          <button
                            type="button"
                            onClick={() => field.removeValue(index)}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    <div>
                      <Input
                        value={directorInput}
                        onChange={(ev) => setDirectorInput(ev.target.value)}
                        onKeyDown={(ev) => ev.key === "Enter" && handleAdd()}
                        placeholder=".. Christopher Nolan, Steven Spielberg"
                      />
                      <Button size="xs" type="button" onClick={handleAdd}>
                        Add
                      </Button>
                    </div>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="actors" mode="array">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                const handleAdd = () => {
                  const names = actorInput
                    .split(",")
                    .map((n) => n.trim())
                    .filter(Boolean);
                  names.forEach((name) => field.pushValue(name));
                  setActorInput("");
                };

                return (
                  <Field data-invalid={isInvalid} className="border p-2">
                    <FieldLabel>Actors</FieldLabel>

                    <div className="py-2">
                      {field.state.value.map((name, index) => (
                        <span
                          className="px-2 py-1 rounded mr-1 mt-1 text-xs text-foreground bg-muted"
                          key={index}
                        >
                          {`${name} `}
                          <button
                            type="button"
                            onClick={() => field.removeValue(index)}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    <div>
                      <Input
                        value={actorInput}
                        onChange={(ev) => setActorInput(ev.target.value)}
                        onKeyDown={(ev) => ev.key === "Enter" && handleAdd()}
                        placeholder=".. Liam Neeson, Steven Seagal"
                      />
                      <Button size="xs" type="button" onClick={handleAdd}>
                        Add
                      </Button>
                    </div>

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Field orientation="horizontal">
              <Button className="cursor-pointer" type="submit">
                Submit
              </Button>
              <Button
                className="cursor-pointer"
                type="reset"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              {isDeleted ? (
                <RestoreMovieButton
                  movieId={movie.id}
                  onSuccess={() => setIsDeleted(false)}
                />
              ) : (
                <DeleteMovieButton
                  movieId={movie.id}
                  onSuccess={() => setIsDeleted(true)}
                />
              )}
              <Button asChild><Link href="/admin-dashboard/admin/movies">Back to movies</Link></Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
