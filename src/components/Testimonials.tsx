import { reviews } from "@/data/reviews";

// Mục cảm nhận khách hàng. Tự ẩn khi chưa có đánh giá nào.
export default function Testimonials() {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-bamboo-50 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-bamboo-800">
          Khách hàng nói gì về Bá Uôn
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-2xl border border-bamboo-200 bg-white p-6"
            >
              <div className="mb-2 text-amber-500" aria-hidden>
                {"★".repeat(Math.max(1, Math.min(5, r.rating)))}
                <span className="text-bamboo-200">
                  {"★".repeat(5 - Math.max(1, Math.min(5, r.rating)))}
                </span>
              </div>
              <blockquote className="flex-1 italic leading-relaxed text-bamboo-700">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-bamboo-900">
                {r.name}
                {r.location && (
                  <span className="font-normal text-bamboo-500">
                    {" "}
                    · {r.location}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
