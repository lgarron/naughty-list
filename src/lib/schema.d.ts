export type NaughtyListEntry = string;

export type NaughtyListConfig = {
  $schema?: string;
  paths: {
    ignore?: NaughtyListEntry[];
    delete?: NaughtyListEntry[];
  };
};
