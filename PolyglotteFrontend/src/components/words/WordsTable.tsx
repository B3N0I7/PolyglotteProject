import React, { useState } from "react";
import type { Word } from "../../features/words/types/word";
import "./WordsTable.css";

interface WordsTableProps {
  words: Word[];
  loading: boolean;
  error: string | null;
  onEdit: (word: Word) => void;
  onDelete: (wordId: string) => void;
}

export const WordsTable: React.FC<WordsTableProps> = ({
  words,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<keyof Word>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Word) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedWords = [...words].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="words-table-container">
        <div className="loading-spinner">
          <p>Chargement des mots...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="words-table-container">
        <div className="error-message">
          <p>❌ {error} </p>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="words-table-container">
        <div className="empty-state">
          <h3>Aucun mot trouvé </h3>
          <p>
            {" "}
            Commencez par ajouter vos premiers mots à votre dictionnaire !{" "}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="words-table-container">
      <div className="words-count">
        <p>
          <strong>{words.length} </strong> mot{words.length > 1 ? "s" : ""} dans
          votre dictionnaire.
        </p>
      </div>

      <div className="table-wrapper">
        <table className="words-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("frenchWord")}
                className={`sortable ${sortField === "frenchWord" ? `sorted-${sortDirection}` : ""}`}
              >
                Mot français
              </th>
              <th
                onClick={() => handleSort("englishWord")}
                className={`sortable ${sortField === "englishWord" ? `sorted-${sortDirection}` : ""}`}
              >
                Mot anglais
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                className={`sortable ${sortField === "createdAt" ? `sorted-${sortDirection}` : ""}`}
              >
                Date d'ajout
              </th>
              <th> Actions </th>
            </tr>
          </thead>
          <tbody>
            {sortedWords.map((word) => (
              <tr key={word.id}>
                <td className="french-word"> {word.frenchWord} </td>
                <td className="english-word"> {word.englishWord} </td>
                <td className="created-date"> {formatDate(word.createdAt)} </td>
                <td className="actions">
                  <button
                    onClick={() => onEdit(word)}
                    className="btn btn-sm btn-secondary"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(word.id)}
                    className="btn btn-sm btn-danger"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WordsTable;
