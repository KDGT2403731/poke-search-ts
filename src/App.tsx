import './App.css'
import SearchForm from './components/SearchForm'
import SearchToggle from './components/SearchToggle'
import { useState, type FormEvent } from 'react';
import type { SearchType } from './types/pokemon';
import { usePokemonSearch } from './hooks/usePokemonSearch';
import PokemonCard from './components/PokemonCard';
import SkeletonLoader from './components/SkeletonLoader';

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('name');
  const { pokemon, error, isLoading, searchPokemon, clearResults } = usePokemonSearch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await searchPokemon(searchTerm, searchType);
    setSearchTerm('');
  }
  const handleTypeChange = (type: SearchType) => {
    setSearchTerm('');
    setSearchType(type);
    clearResults();
  }
  return (
    <div className="app">
      <h1>Poké Search</h1>
      <p className="description">Search for a Pokémon by name or ID</p>
      <SearchToggle searchType={searchType} onTypeChange={handleTypeChange} />
      <SearchForm 
        searchTerm={searchTerm}
        searchType={searchType}
        isLoading={isLoading}
        onSearchTermChange={setSearchTerm}
        onSubmit={handleSubmit}
      />
      {error && <div className="error-message">{error.message}</div>}
      {isLoading && <SkeletonLoader />}
      {pokemon && <PokemonCard pokemon={pokemon} />}
    </div>
  );
}

export default App
