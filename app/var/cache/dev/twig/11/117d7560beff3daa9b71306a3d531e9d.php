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

/* history/index.html.twig */
class __TwigTemplate_663be4c2edf6bb85e32717b83aea1798 extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'title' => [$this, 'block_title'],
            'body' => [$this, 'block_body'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 2
        return "base.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "history/index.html.twig"));

        $this->parent = $this->loadTemplate("base.html.twig", "history/index.html.twig", 2);
        yield from $this->parent->unwrap()->yield($context, array_merge($this->blocks, $blocks));
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

    }

    // line 4
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "title"));

        yield "Payment History";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 6
    public function block_body($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "body"));

        // line 7
        yield "<div class=\"home-container\">
    <h1 class=\"page-title\">Transactions</h1>
    <h2 class=\"section-title\">Activity</h2>
    <h3 class=\"sub-section-title\">Your full activity history for this account</h3>
    <pre>";
        // line 11
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(json_encode((isset($context["payments_in"]) || array_key_exists("payments_in", $context) ? $context["payments_in"] : (function () { throw new RuntimeError('Variable "payments_in" does not exist.', 11, $this->source); })()), Twig\Extension\CoreExtension::constant("JSON_PRETTY_PRINT")), "html", null, true);
        yield "</pre>
    <pre>";
        // line 12
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(json_encode((isset($context["payments_out"]) || array_key_exists("payments_out", $context) ? $context["payments_out"] : (function () { throw new RuntimeError('Variable "payments_out" does not exist.', 12, $this->source); })()), Twig\Extension\CoreExtension::constant("JSON_PRETTY_PRINT")), "html", null, true);
        yield "</pre>
</div>
";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "history/index.html.twig";
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
        return array (  85 => 12,  81 => 11,  75 => 7,  68 => 6,  54 => 4,  37 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("{# templates/history/index.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Payment History{% endblock %}

{% block body %}
<div class=\"home-container\">
    <h1 class=\"page-title\">Transactions</h1>
    <h2 class=\"section-title\">Activity</h2>
    <h3 class=\"sub-section-title\">Your full activity history for this account</h3>
    <pre>{{ payments_in|json_encode(constant('JSON_PRETTY_PRINT')) }}</pre>
    <pre>{{ payments_out|json_encode(constant('JSON_PRETTY_PRINT')) }}</pre>
</div>
{% endblock %}
", "history/index.html.twig", "/var/www/symfony_docker/templates/history/index.html.twig");
    }
}
