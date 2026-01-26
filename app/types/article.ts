export interface Module {
    id: number;
    name: string;
    active: boolean;
    created_at: string;
}

export interface Article {
    id: number;
    original_title: string;
    original_description: string;
    source_url?: string;
    status: string;
    created_at: string;
    updated_at: string;
    last_version_at?: string | null;
    last_version_created_at?: string | null;
    last_version_content?: string | null;
    modules: Module[];
    versions_count?: number;
}
