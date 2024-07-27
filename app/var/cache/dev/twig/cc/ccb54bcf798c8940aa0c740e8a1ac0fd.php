<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* base.html.twig */
class __TwigTemplate_d989befde6e166c6a22fbb7c85547343 extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
            'title' => [$this, 'block_title'],
            'stylesheets' => [$this, 'block_stylesheets'],
            'javascripts' => [$this, 'block_javascripts'],
            'body' => [$this, 'block_body'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "base.html.twig"));

        // line 2
        yield "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>";
        // line 6
        yield from $this->unwrap()->yieldBlock('title', $context, $blocks);
        yield "</title>
    <link rel=\"stylesheet\" href=\"";
        // line 7
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\AssetExtension']->getAssetUrl("css/style.css"), "html", null, true);
        yield "\">
    ";
        // line 8
        yield from $this->unwrap()->yieldBlock('stylesheets', $context, $blocks);
        // line 9
        yield "    ";
        yield from $this->unwrap()->yieldBlock('javascripts', $context, $blocks);
        // line 24
        yield "</head>
<body>
    <div class=\"wrapper\">
        <nav class=\"sidebar\">
            <div class=\"sidebar-header\">
                <h3>Sample Wallet</h3>
            </div>
            <nav>
               <ul>
                   <li class=\"";
        // line 33
        if ((CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, (isset($context["app"]) || array_key_exists("app", $context) ? $context["app"] : (function () { throw new RuntimeError('Variable "app" does not exist.', 33, $this->source); })()), "request", [], "any", false, false, false, 33), "get", ["_route"], "method", false, false, false, 33) == "index")) {
            yield "active";
        }
        yield "\"><a href=\"";
        yield $this->extensions['Symfony\Bridge\Twig\Extension\RoutingExtension']->getPath("index");
        yield "\">Dashboard</a></li>
                   <li class=\"";
        // line 34
        if ((CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, (isset($context["app"]) || array_key_exists("app", $context) ? $context["app"] : (function () { throw new RuntimeError('Variable "app" does not exist.', 34, $this->source); })()), "request", [], "any", false, false, false, 34), "get", ["_route"], "method", false, false, false, 34) == "app_history")) {
            yield "active";
        }
        yield "\"><a href=\"";
        yield $this->extensions['Symfony\Bridge\Twig\Extension\RoutingExtension']->getPath("history");
        yield "\">Transactions</a></li>
                   <li class=\"";
        // line 35
        if ((CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, (isset($context["app"]) || array_key_exists("app", $context) ? $context["app"] : (function () { throw new RuntimeError('Variable "app" does not exist.', 35, $this->source); })()), "request", [], "any", false, false, false, 35), "get", ["_route"], "method", false, false, false, 35) == "app_settings")) {
            yield "active";
        }
        yield "\"><a href=\"";
        yield $this->extensions['Symfony\Bridge\Twig\Extension\RoutingExtension']->getPath("app_settings");
        yield "\">Settings</a></li>
               </ul>
           </nav>
            <div class=\"sidebar-bottom\">
                ";
        // line 39
        if (CoreExtension::getAttribute($this->env, $this->source, (isset($context["app"]) || array_key_exists("app", $context) ? $context["app"] : (function () { throw new RuntimeError('Variable "app" does not exist.', 39, $this->source); })()), "user", [], "any", false, false, false, 39)) {
            // line 40
            yield "                    <nav>
                      <ul>
                        <li class=\"border\"><a>";
            // line 42
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, CoreExtension::getAttribute($this->env, $this->source, (isset($context["app"]) || array_key_exists("app", $context) ? $context["app"] : (function () { throw new RuntimeError('Variable "app" does not exist.', 42, $this->source); })()), "user", [], "any", false, false, false, 42), "email", [], "any", false, false, false, 42), "html", null, true);
            yield "</a></li>
                        <li class=\"border\"><a href=\"";
            // line 43
            yield $this->extensions['Symfony\Bridge\Twig\Extension\RoutingExtension']->getPath("logout");
            yield "\">Logout</a></li>
                        <li class=\"border footer\"><a href=\"https://github.com/djahwork/phoenix-server-wallet-bounty\">Version 0.1.0 Github</a></li>
                    </ul>
                  </nav>
                ";
        }
        // line 48
        yield "            </div>
        </nav>

        <div class=\"content\">
            <div class=\"container-fluid\">
                ";
        // line 53
        yield from $this->unwrap()->yieldBlock('body', $context, $blocks);
        // line 54
        yield "            </div>
        </div>
    </div>
</body>
</html>
";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 6
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "title"));

        yield "Dashboard";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 8
    public function block_stylesheets($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "stylesheets"));

        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 9
    public function block_javascripts($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "javascripts"));

        // line 10
        yield "    ";
        // line 11
        yield "  <script src=\"";
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\AssetExtension']->getAssetUrl("js/qrcode.js"), "html", null, true);
        yield "\"></script>
  <script src=\"";
        // line 12
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Symfony\Bridge\Twig\Extension\AssetExtension']->getAssetUrl("js/show_qr.js"), "html", null, true);
        yield "\"></script>
\t<script>
\tfunction copyToClipboard(to_copy) {
\t    const copyText = document.querySelector(to_copy).innerText;
\t    navigator.clipboard.writeText(copyText).then(() => {
\t\talert('Text copied to clipboard');
\t    }).catch(err => {
\t\talert('Failed to copy text: ', err);
\t    });
\t}
\t</script>
    ";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 53
    public function block_body($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "body"));

        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "base.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  203 => 53,  183 => 12,  178 => 11,  176 => 10,  169 => 9,  156 => 8,  142 => 6,  129 => 54,  127 => 53,  120 => 48,  112 => 43,  108 => 42,  104 => 40,  102 => 39,  91 => 35,  83 => 34,  75 => 33,  64 => 24,  61 => 9,  59 => 8,  55 => 7,  51 => 6,  45 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("{# templates/base.html.twig #}
<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>{% block title %}Dashboard{% endblock %}</title>
    <link rel=\"stylesheet\" href=\"{{ asset('css/style.css') }}\">
    {% block stylesheets %}{% endblock %}
    {% block javascripts %}
    {# templates/base.html.twig ou un fichier JavaScript séparé #}
  <script src=\"{{ asset('js/qrcode.js') }}\"></script>
  <script src=\"{{ asset('js/show_qr.js') }}\"></script>
\t<script>
\tfunction copyToClipboard(to_copy) {
\t    const copyText = document.querySelector(to_copy).innerText;
\t    navigator.clipboard.writeText(copyText).then(() => {
\t\talert('Text copied to clipboard');
\t    }).catch(err => {
\t\talert('Failed to copy text: ', err);
\t    });
\t}
\t</script>
    {% endblock %}
</head>
<body>
    <div class=\"wrapper\">
        <nav class=\"sidebar\">
            <div class=\"sidebar-header\">
                <h3>Sample Wallet</h3>
            </div>
            <nav>
               <ul>
                   <li class=\"{% if app.request.get('_route') == 'index' %}active{% endif %}\"><a href=\"{{ path('index') }}\">Dashboard</a></li>
                   <li class=\"{% if app.request.get('_route') == 'app_history' %}active{% endif %}\"><a href=\"{{ path('history') }}\">Transactions</a></li>
                   <li class=\"{% if app.request.get('_route') == 'app_settings' %}active{% endif %}\"><a href=\"{{ path('app_settings') }}\">Settings</a></li>
               </ul>
           </nav>
            <div class=\"sidebar-bottom\">
                {% if app.user %}
                    <nav>
                      <ul>
                        <li class=\"border\"><a>{{ app.user.email }}</a></li>
                        <li class=\"border\"><a href=\"{{ path('logout') }}\">Logout</a></li>
                        <li class=\"border footer\"><a href=\"https://github.com/djahwork/phoenix-server-wallet-bounty\">Version 0.1.0 Github</a></li>
                    </ul>
                  </nav>
                {% endif %}
            </div>
        </nav>

        <div class=\"content\">
            <div class=\"container-fluid\">
                {% block body %}{% endblock %}
            </div>
        </div>
    </div>
</body>
</html>
", "base.html.twig", "/var/www/symfony_docker/templates/base.html.twig");
    }
}
