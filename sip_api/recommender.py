"""
Functions that measure similarity between beans
"""

from typing import List

def calculate_similarity(notes1: List[str], notes2: List[str]) -> float:
    """
    Calculates similarity between the taste notes of beans
    """
    set1 = set(note.lower().strip() for note in notes1)
    set2 = set(note.lower().strip() for note in notes2)

    intersection = set1.intersection(set2)
    union = set1.union(set2)

    if not union:
        return 0.0

    return len(intersection) / len(union)
