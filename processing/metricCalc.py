# Calculate the min and max values for the attributes
min_max_metrics = {}

# Calculate min and max for continuous variables
min_max_metrics['min_danceability'] = df['danceability'].min()
min_max_metrics['max_danceability'] = df['danceability'].max()
min_max_metrics['min_energy'] = df['energy'].min()
min_max_metrics['max_energy'] = df['energy'].max()
min_max_metrics['min_loudness'] = df['loudness'].min()
min_max_metrics['max_loudness'] = df['loudness'].max()
min_max_metrics['min_speechiness'] = df['speechiness'].min()
min_max_metrics['max_speechiness'] = df['speechiness'].max()
min_max_metrics['min_acousticness'] = df['acousticness'].min()
min_max_metrics['max_acousticness'] = df['acousticness'].max()
min_max_metrics['min_instrumentalness'] = df['instrumentalness'].min()
min_max_metrics['max_instrumentalness'] = df['instrumentalness'].max()
min_max_metrics['min_liveness'] = df['liveness'].min()
min_max_metrics['max_liveness'] = df['liveness'].max()
min_max_metrics['min_valence'] = df['valence'].min()
min_max_metrics['max_valence'] = df['valence'].max()
min_max_metrics['min_tempo'] = df['tempo'].min()
min_max_metrics['max_tempo'] = df['tempo'].max()

# Calculate min and max for categorical variables (key and mode)
min_max_metrics['min_key'] = df['key'].min()
min_max_metrics['max_key'] = df['key'].max()
min_max_metrics['min_mode'] = df['mode'].min()
min_max_metrics['max_mode'] = df['mode'].max()

min_max_metrics
