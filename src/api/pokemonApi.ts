import axios, { AxiosError } from 'axios';
import type { Pokemon, AppError, SearchType } from '../types/pokemon';

const NUMERIC_REGEX = /^\d+$/;
const NAME_REGEX = /^[a-zA-Z-]+$/;
const BASE_URL = "https://pokeapi.co/api/v2";

type ValidationResult = {
    isValid: boolean;
    errorMessage: string;
}

export const validateInput = (query: string, type: SearchType): ValidationResult => {
    if (!query) {
        return {
            isValid: false,
            errorMessage:
            type === 'name'
            ? 'ポケモン名を入力してください'
            : 'ポケモンIDを入力してください'
        };
    }

    if (type === 'name') {
        if (query.length < 2) {
            return {
                isValid: false,
                errorMessage: 'ポケモン名は2文字以上で入力してください'
            };
        }
        if (!NAME_REGEX.test(query)) {
            return {
                isValid: false,
                errorMessage: 'ポケモン名は英字とハイフンのみ使用できます'
            };
        }
    } else {
        if (!NUMERIC_REGEX.test(query) || parseInt(query, 10) < 1) {
            return {
                isValid: false,
                errorMessage: 'ポケモンIDは1以上の数値で入力してください'
            };
        }
    }

    return {
        isValid: true,
        errorMessage: ''
    };
}

const createAppError = (message: string, status: number): AppError => ({
    message,
    status
});

export const fetchPokemon = async (
    query: string,
    type: SearchType
): Promise<Pokemon | AppError> => {
    const trimmedQuery = query.trim();
    const validation = validateInput(trimmedQuery, type);

    if (!validation.isValid) {
        return createAppError(validation.errorMessage, 400);
    }

    try {
        const response = await axios.get<Pokemon>(
            `${BASE_URL}/pokemon/${trimmedQuery.toLowerCase()}`,
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return createAppError(
                error.response?.status === 404
                    ? `ポケモン "${query}" が見つかりません`
                    : `APIエラーが発生しました (${error.response?.status})`,
                error.response?.status || 500,
            );
        }
        return createAppError('予期しないエラーが発生しました', 500);
    }
};