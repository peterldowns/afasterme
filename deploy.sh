dotcloud push afasterme;
dotcloud run afasterme.www "cat > current/src/conf.py" < python/src/conf.py;
dotcloud run afasterme.www "tail -f /var/log/supervisor/uwsgi.log";
