import { organisms } from "./organisms";

function uniqueOptions(key) {
  return [...new Set(organisms.map((organism) => organism[key]))]
    .sort()
    .map((value) => ({ value, label: value, hint: "" }));
}

export const FULL_RANKS = ["domain", "kingdom", "phylum", "class", "order", "family", "genus", "species"];

export const DOMAINS = [
  { value: "Eukaryota", label: "Eukaryota", hint: "cells with a nucleus" },
  { value: "Bacteria", label: "Bacteria", hint: "prokaryotes, no nucleus" },
  { value: "Archaea", label: "Archaea", hint: "prokaryotes, distinct from bacteria" },
];

export const KINGDOMS = [
  { value: "Animalia", label: "Animalia", hint: "animals" },
  { value: "Plantae", label: "Plantae", hint: "plants" },
  { value: "Fungi", label: "Fungi", hint: "mushrooms, yeasts & molds" },
  { value: "Protista", label: "Protista", hint: "single-celled eukaryotes" },
  { value: "Bacteria", label: "Bacteria", hint: "prokaryotes (Monera)" },
];

export const PHYLA = [
  { value: "Chordata", label: "Chordata", hint: "backbone or notochord" },
  { value: "Arthropoda", label: "Arthropoda", hint: "jointed legs, exoskeleton" },
  { value: "Mollusca", label: "Mollusca", hint: "soft body, often shelled" },
  { value: "Cnidaria", label: "Cnidaria", hint: "stinging cells" },
  { value: "Echinodermata", label: "Echinodermata", hint: "spiny skin" },
  { value: "Annelida", label: "Annelida", hint: "segmented worms" },
  { value: "Porifera", label: "Porifera", hint: "pore-bearing filter feeders" },
  { value: "Tracheophyta", label: "Tracheophyta", hint: "vascular plants" },
  { value: "Bryophyta", label: "Bryophyta", hint: "non-vascular plants" },
  { value: "Basidiomycota", label: "Basidiomycota", hint: "club fungi" },
  { value: "Ascomycota", label: "Ascomycota", hint: "sac fungi" },
  { value: "Amoebozoa", label: "Amoebozoa", hint: "flows with false feet" },
  { value: "Ciliophora", label: "Ciliophora", hint: "covered in tiny hairs" },
  { value: "Proteobacteria", label: "Proteobacteria", hint: "diverse bacteria" },
  { value: "Cyanobacteria", label: "Cyanobacteria", hint: "photosynthetic bacteria" },
];

export const CLASSES = [
  { value: "Mammalia", label: "Mammalia", hint: "fur & milk" },
  { value: "Aves", label: "Aves", hint: "feathers & beaks" },
  { value: "Reptilia", label: "Reptilia", hint: "scales & eggs on land" },
  { value: "Amphibia", label: "Amphibia", hint: "life in water and on land" },
  { value: "Actinopterygii", label: "Actinopterygii", hint: "ray-finned fish" },
  { value: "Chondrichthyes", label: "Chondrichthyes", hint: "cartilaginous fish" },
  { value: "Insecta", label: "Insecta", hint: "six legs, three body parts" },
  { value: "Arachnida", label: "Arachnida", hint: "eight legs" },
  { value: "Malacostraca", label: "Malacostraca", hint: "crabs, lobsters & friends" },
  { value: "Cephalopoda", label: "Cephalopoda", hint: "tentacles & big brains" },
  { value: "Gastropoda", label: "Gastropoda", hint: "slugs & snails" },
  { value: "Scyphozoa", label: "Scyphozoa", hint: "large jellyfish" },
  { value: "Asteroidea", label: "Asteroidea", hint: "sea stars" },
  { value: "Clitellata", label: "Clitellata", hint: "segmented worms" },
  { value: "Demospongiae", label: "Demospongiae", hint: "sponges" },
  { value: "Magnoliopsida", label: "Magnoliopsida", hint: "flowering plants" },
  { value: "Bryopsida", label: "Bryopsida", hint: "mosses" },
  { value: "Agaricomycetes", label: "Agaricomycetes", hint: "mushroom-forming fungi" },
  { value: "Saccharomycetes", label: "Saccharomycetes", hint: "budding yeasts" },
  { value: "Eurotiomycetes", label: "Eurotiomycetes", hint: "molds" },
  { value: "Tubulinea", label: "Tubulinea", hint: "amoebas with tube-like pseudopods" },
  { value: "Oligohymenophorea", label: "Oligohymenophorea", hint: "ciliates" },
  { value: "Gammaproteobacteria", label: "Gammaproteobacteria", hint: "rod-shaped bacteria" },
  { value: "Cyanophyceae", label: "Cyanophyceae", hint: "blue-green bacteria" },
];

export const ORDERS = uniqueOptions("order");
export const FAMILIES = uniqueOptions("family");
export const GENERA = uniqueOptions("genus");
export const SPECIES = uniqueOptions("species");

export const MODE_CONFIG = {
  full: {
    id: "full",
    title: "Full Ladder",
    rank: "full classification",
    icon: "🏆",
    blurb: "All the ranks at once — build the whole classification chain!",
    options: [],
    accent: "#e86f9d",
    soft: "rgba(232, 111, 157, 0.14)",
  },
  domain: {
    id: "domain",
    title: "Domain Dive",
    rank: "domain",
    icon: "🌐",
    blurb: "The widest branch of life. Nucleus or no nucleus?",
    options: DOMAINS,
    accent: "#7c6bd6",
    soft: "rgba(124, 107, 214, 0.14)",
  },
  kingdom: {
    id: "kingdom",
    title: "Kingdom Match",
    rank: "kingdom",
    icon: "👑",
    blurb: "Every living thing belongs to a kingdom. Find the right crown!",
    options: KINGDOMS,
    accent: "#e86f9d",
    soft: "rgba(232, 111, 157, 0.14)",
  },
  phylum: {
    id: "phylum",
    title: "Phylum Safari",
    rank: "phylum",
    icon: "🧭",
    blurb: "Look at body plans and body parts to track down the phylum.",
    options: PHYLA,
    accent: "#5b9bd8",
    soft: "rgba(91, 155, 216, 0.14)",
  },
  class: {
    id: "class",
    title: "Class Climb",
    rank: "class",
    icon: "🪜",
    blurb: "Feathers, fur, fins, or six legs? Pick the class that fits.",
    options: CLASSES,
    accent: "#7c6bd6",
    soft: "rgba(124, 107, 214, 0.14)",
  },
  order: {
    id: "order",
    title: "Order Odyssey",
    rank: "order",
    icon: "🗺️",
    blurb: "Related families gather into orders. Follow the trail!",
    options: ORDERS,
    accent: "#57b89d",
    soft: "rgba(87, 184, 157, 0.14)",
  },
  family: {
    id: "family",
    title: "Family Finder",
    rank: "family",
    icon: "🐾",
    blurb: "Genera nest inside families. Track down the family name.",
    options: FAMILIES,
    accent: "#e86f9d",
    soft: "rgba(232, 111, 157, 0.14)",
  },
  genus: {
    id: "genus",
    title: "Genus Puzzle",
    rank: "genus",
    icon: "🧩",
    blurb: "Closely related species share a genus. Solve the puzzle.",
    options: GENERA,
    accent: "#5b9bd8",
    soft: "rgba(91, 155, 216, 0.14)",
  },
  species: {
    id: "species",
    title: "Species Spot",
    rank: "species",
    icon: "🔬",
    blurb: "The most specific name of all — the exact species.",
    options: SPECIES,
    accent: "#7c6bd6",
    soft: "rgba(124, 107, 214, 0.14)",
  },
};

export const MODE_IDS = Object.keys(MODE_CONFIG);

export function optionFor(mode, value) {
  return MODE_CONFIG[mode].options.find((option) => option.value === value) ?? {
    value,
    label: value,
    hint: "",
  };
}
