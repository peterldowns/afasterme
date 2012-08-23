dotcloud push afasterme;
dotcloud run afasterme.www "tail -f /var/log/supervisor/uwsgi.log";
