# pylint: disable=E0401, W0611
"""
Functions that measure similarity between beans
"""

from typing import List
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_ranked_recommendations(target_bean, all_beans, limit=5):
    """
    Ranks all beans based on semantic similarity with null-safety.
    """
    def build_weighted_string(b):
        notes_list = b.taste_notes if isinstance(b.taste_notes, list) else []
        notes = " ".join(notes_list * 3)

        roast = (str(b.roast_type or "") + " ") * 2
        process = str(b.process or "")
        country = str(b.country or "")

        return f"{notes} {roast} {process} {country}".lower().strip()

    target_str = build_weighted_string(target_bean)
    target_vec = model.encode([target_str])

    scored_beans = []

    other_beans = [b for b in all_beans if b.id != target_bean.id]
    if not other_beans:
        return []

    other_descriptions = [build_weighted_string(b) for b in other_beans]
    other_vectors = model.encode(other_descriptions)

    similarities = cosine_similarity(target_vec, other_vectors)[0]

    for i, score in enumerate(similarities):
        bean = other_beans[i]
        final_score = float(score)

        if target_bean.elevation is not None and bean.elevation is not None:
            try:
                # Convert to float to handle potential string-formatted numbers
                diff = abs(float(target_bean.elevation) - float(bean.elevation))
                if diff < 200:
                    final_score += 0.01
            except (ValueError, TypeError):
                pass

        bean.vibe_score = round(final_score * 100, 1)
        scored_beans.append(bean)

    scored_beans.sort(key=lambda x: x.vibe_score, reverse=True)

    return scored_beans[:limit]

def semantic_search(query: str, all_beans: list, limit=10):
    """
    Finds beans that match a natural language query.
    """
    if not all_beans:
        return []

    query_vec = model.encode([query.lower()])

    def build_weighted_string(b):
        notes_list = b.taste_notes if isinstance(b.taste_notes, list) else []
        notes = " ".join(notes_list * 3)
        roast = (str(b.roast_type or "") + " ") * 2
        return f"{notes} {roast} {b.process or ''} {b.country or ''}".lower().strip()

    descriptions = [build_weighted_string(b) for b in all_beans]
    bean_vectors = model.encode(descriptions)

    similarities = cosine_similarity(query_vec, bean_vectors)[0]

    results = []
    for i, score in enumerate(similarities):
        bean = all_beans[i]
        # Attach the search score
        bean.vibe_score = round(float(score) * 100, 1)
        results.append(bean)

    results.sort(key=lambda x: x.vibe_score, reverse=True)
    return results[:limit]
