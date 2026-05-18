"use client";

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
import { addMovie } from "../_actions/movie-actions";
import { useRouter } from "next/navigation";
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
import React, { useState } from "react";
import { genreArray } from "@/lib/genres";
import { toast } from "sonner";

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

type FormValues = z.infer<typeof formSchema>;

export default function AddMovieForm() {
  const router = useRouter();
  const anchor = useComboboxAnchor();
  const [directorInput, setDirectorInput] = useState("");
  const [actorInput, setActorInput] = useState("");

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "" as unknown as number,
      releaseDate: "",
      imageUrl: "",
      stock: "" as unknown as number,
      runtime: "" as unknown as number,
      genres: [] as FormValues["genres"],
      directors: [] as string[],
      actors: [] as string[],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await addMovie({
        ...value,
        price: Math.round(value.price * 100),
      });
      if (result.error) {
        console.log(result.error);
        return;
      } else {
        toast.success("Movie was added to the database.", {
          position: "bottom-right",
        });
        router.push("/");
      }
    },
  });
  return (
    <Card className="border border-(--gold)/30 bg-sidebar-accent/40 max-w-3xl mt-10">
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
                    className="border-r border-b border-(--gold)/40 "
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
                    className="border-r border-b border-(--gold)/40 "
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
                    className="border-r border-b border-(--gold)/40 "
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
                    className="border-r border-b border-(--gold)/40 "
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
                      className="border-r border-b border-(--gold)/40 "
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
                      className="border-r border-b border-(--gold)/40 "
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
                      className="border-r border-b border-(--gold)/40 "
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
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <ComboboxChips ref={anchor} className="w-full max-w-full border border-(--gold)/40">
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

                    <div className="px-4 py-2">
                      {field.state.value.map((name, index) => (
                        <span
                          className=" px-2 py-1 rounded mr-1 mt-1 text-xs text-background bg-(--gold)"
                          key={index}
                        >
                          {`${name} `}
                          <button
                            type="button"
                            onClick={() => field.removeValue(index)}
                            className="hover:opacity-100 opacity-50"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="relative flex items-center">
                      <Input
                      className="border border-(--gold)/40 pr-16 "
                        value={directorInput}
                        onChange={(ev) => setDirectorInput(ev.target.value)}
                        onKeyDown={(ev) => ev.key === "Enter" && handleAdd()}
                        placeholder=".. Christopher Nolan, Steven Spielberg"
                      />
                      <Button size="xs" type="button" onClick={handleAdd} className="absolute right-1 my-auto">
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

                    <div className="px-4 py-2">
                      {field.state.value.map((name, index) => (
                        <span
                          className="px-2 py-1 rounded mr-1 mt-1 text-xs text-background bg-(--gold)"
                          key={index}
                        >
                          {`${name} `}
                          <button
                            type="button"
                            onClick={() => field.removeValue(index)}
                            className="opacity-50 hover:opacity-100"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="relative flex items-center">
                      <Input
                      className="border border-(--gold)/40 pr-16"
                        value={actorInput}
                        onChange={(ev) => setActorInput(ev.target.value)}
                        onKeyDown={(ev) => ev.key === "Enter" && handleAdd()}
                        placeholder=".. Liam Neeson, Steven Seagal"
                      />
                      <Button className="my-auto absolute right-1" size="xs" type="button" onClick={handleAdd}>
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
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
