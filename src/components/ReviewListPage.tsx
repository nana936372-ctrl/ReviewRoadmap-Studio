import { ArrowLeft, CalendarDays, MessageSquareText, Star } from 'lucide-react';
import type { RawReview } from '../domain/types';
import type { AppCopy } from '../i18n/copy';

interface ReviewListPageProps {
  analyzedCount: number;
  copy: AppCopy['reviewsPage'];
  onBack: () => void;
  reviews: RawReview[];
}

function formatDate(value: string): string {
  return value ? value.slice(0, 10) : '-';
}

export function ReviewListPage({ analyzedCount, copy, onBack, reviews }: ReviewListPageProps) {
  return (
    <section id="review-list-page" className="review-list-page" aria-labelledby="review-list-title">
      <button className="detail-back" type="button" onClick={onBack}>
        <ArrowLeft aria-hidden="true" size={16} />
        {copy.back}
      </button>

      <div className="detail-hero review-list-hero">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="review-list-title">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>
        <div className="review-list-mark" aria-hidden="true">
          <MessageSquareText size={32} />
        </div>
      </div>

      <div className="review-list-summary" aria-label={copy.summaryLabel}>
        <span>{copy.fetchedCount(reviews.length)}</span>
        <span>{copy.analyzedCount(analyzedCount)}</span>
      </div>

      {reviews.length === 0 ? (
        <p className="review-list-empty">{copy.empty}</p>
      ) : (
        <div className="review-record-list">
          {reviews.map((review) => (
            <article className="review-record-card" key={review.id}>
              <div className="review-record-header">
                <div>
                  <p className="review-record-meta">
                    <span>
                      <Star aria-hidden="true" size={15} />
                      {copy.rating(review.rating)}
                    </span>
                    <span>
                      <CalendarDays aria-hidden="true" size={15} />
                      {formatDate(review.date)}
                    </span>
                  </p>
                  <h3>{review.title || copy.untitled}</h3>
                </div>
                <span className="review-source-pill">{copy.sourceValues[review.source]}</span>
              </div>

              <p className="review-record-body">{review.body}</p>

              <dl className="review-record-details">
                <div>
                  <dt>{copy.version}</dt>
                  <dd>{review.appVersion}</dd>
                </div>
                <div>
                  <dt>{copy.source}</dt>
                  <dd>{copy.sourceValues[review.source]}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
