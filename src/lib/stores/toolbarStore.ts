import { writable } from "svelte/store";

export interface MenuItem {
    label: string;
    action?: () => void;
    href?: string;
}

export interface ToolbarButton {
    label: string;
    action: () => void;
}

interface ToolbarState {
    menuOpen: boolean;
    menuItems: MenuItem[];
    leftButton: ToolbarButton | null;
    cancelButton: ToolbarButton | null;
}

// Default state
const createToolbarStore = () => {
    const { subscribe, set, update } = writable<ToolbarState>({
        menuOpen: false,
        menuItems: [],
        leftButton: null,
        cancelButton: null,
    });

    return {
        subscribe,

        // Toggle menu open/close
        toggleMenu: () =>
            update((state) => ({ ...state, menuOpen: !state.menuOpen })),
        // Close menu
        closeMenu: () => update((state) => ({ ...state, menuOpen: false })),
        // Set menu items
        setMenuItems: (items: MenuItem[]) =>
            update((state) => ({ ...state, menuItems: items })),
        // Set left button
        setLeftButton: (button: ToolbarButton | null) =>
            update((state) => ({ ...state, leftButton: button })),
        // Set cancel button
        setCancelButton: (button: ToolbarButton | null) =>
            update((state) => ({ ...state, cancelButton: button })),
        // Reset to default state
        reset: () =>
            set({
                menuOpen: false,
                menuItems: [],
                leftButton: null,
                cancelButton: null,
            }),
    };
};
export const toolbarStore = createToolbarStore();