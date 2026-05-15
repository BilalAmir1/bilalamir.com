
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SkillContextType {
    activeSkills: string[];
    setActiveSkills: (skills: string[]) => void;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export function SkillProvider({ children }: { children: ReactNode }) {
    const [activeSkills, setActiveSkills] = useState<string[]>([]);

    return (
        <SkillContext.Provider value={{ activeSkills, setActiveSkills }}>
            {children}
        </SkillContext.Provider>
    );
}

export function useSkillContext() {
    const context = useContext(SkillContext);
    if (context === undefined) {
        throw new Error("useSkillContext must be used within a SkillProvider");
    }
    return context;
}