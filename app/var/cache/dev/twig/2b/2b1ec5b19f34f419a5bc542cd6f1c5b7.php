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

/* index.html.twig */
class __TwigTemplate_170c781133a3ad51de65002c89eab15d extends Template
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
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "index.html.twig"));

        $this->parent = $this->loadTemplate("base.html.twig", "index.html.twig", 2);
        yield from $this->parent->unwrap()->yield($context, array_merge($this->blocks, $blocks));
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

    }

    // line 4
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "title"));

        yield "Home";
        
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
    <h1 class=\"main-title\">Home</h1>
    <h2 class=\"balance-title\">Balance</h2>
    <div class=\"balance-bar\">
        <a href=\"";
        // line 11
        yield $this->extensions['Symfony\Bridge\Twig\Extension\RoutingExtension']->getPath("pay_invoice");
        yield "\" class=\"btn-receive no-underline\">Send</a>
        <span class=\"balance-value\">";
        // line 12
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["balance"]) || array_key_exists("balance", $context) ? $context["balance"] : (function () { throw new RuntimeError('Variable "balance" does not exist.', 12, $this->source); })()), "balanceSat", [], "any", false, false, false, 12), "html", null, true);
        yield "</span>
        <a href=\"";
        // line 13
        yield $this->extensions['Symfony\Bridge\Twig\Extension\RoutingExtension']->getPath("create_invoice");
        yield "\" class=\"btn-receive no-underline\">Receive</a>
    </div>
    <h2 class=\"section-title\">Liquidity</h2>
    <h2 class=\"section-title\">Offers</h2>
    <p>This is your node's Bolt 12 offer. A static and reusable payment request that does not expire.</p>
    <div class=\"copy-bar\">
        <span class=\"copy-text-12\">";
        // line 19
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((isset($context["offer"]) || array_key_exists("offer", $context) ? $context["offer"] : (function () { throw new RuntimeError('Variable "offer" does not exist.', 19, $this->source); })()), "html", null, true);
        yield "</span>
        <button class=\"btn-copy\" onclick=\"copyToClipboard('.copy-text-12')\">Copy Text</button>
    </div>
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
        return "index.html.twig";
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
        return array (  98 => 19,  89 => 13,  85 => 12,  81 => 11,  75 => 7,  68 => 6,  54 => 4,  37 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("{# templates/index.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Home{% endblock %}

{% block body %}
<div class=\"home-container\">
    <h1 class=\"main-title\">Home</h1>
    <h2 class=\"balance-title\">Balance</h2>
    <div class=\"balance-bar\">
        <a href=\"{{ path('pay_invoice') }}\" class=\"btn-receive no-underline\">Send</a>
        <span class=\"balance-value\">{{ balance.balanceSat }}</span>
        <a href=\"{{ path('create_invoice') }}\" class=\"btn-receive no-underline\">Receive</a>
    </div>
    <h2 class=\"section-title\">Liquidity</h2>
    <h2 class=\"section-title\">Offers</h2>
    <p>This is your node's Bolt 12 offer. A static and reusable payment request that does not expire.</p>
    <div class=\"copy-bar\">
        <span class=\"copy-text-12\">{{ offer }}</span>
        <button class=\"btn-copy\" onclick=\"copyToClipboard('.copy-text-12')\">Copy Text</button>
    </div>
</div>
{% endblock %}

", "index.html.twig", "/var/www/symfony_docker/templates/index.html.twig");
    }
}
