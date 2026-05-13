import AddMovieForm from "./_components/add-movie-form";


export default function AddMoviePage(){

    return(<div className="p-8">
        <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide" style={{ color: "var(--text)" }}>
            Add <span style={{ color: "var(--gold)" }}>Movie</span>
          </h1>
          <p className="mt-1 font-serif italic" style={{ color: "var(--text-muted)" }}>
            Add a new movie to the database
          </p>
        </div>
      </div>
        <AddMovieForm/>
    </div>)
}