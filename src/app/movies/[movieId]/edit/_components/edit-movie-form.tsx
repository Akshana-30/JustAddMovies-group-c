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
  };
};

export default function EditMovieForm({ movie }: Props) {
  return <div></div>;
}
