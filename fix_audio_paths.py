import json

# Lire le fichier JSON
with open('jeu-cartes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Fonction pour corriger les chemins audio
def fix_audio_path(obj):
    if isinstance(obj, dict):
        for key, value in obj.items():
            if key == 'file' and isinstance(value, str) and value.startswith('/audio/'):
                obj[key] = value[1:]  # Enlever le premier caractère '/'
            elif isinstance(value, (dict, list)):
                fix_audio_path(value)
    elif isinstance(obj, list):
        for item in obj:
            fix_audio_path(item)

# Corriger tous les chemins
fix_audio_path(data)

# Écrire le fichier corrigé
with open('jeu-cartes.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Chemins audio corrigés !")
